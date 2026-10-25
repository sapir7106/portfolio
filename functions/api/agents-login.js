// Best-effort per-isolate protection. A verified Cloudflare edge rule is also
// required: isolate restarts and distributed requests do not share this map.
const attempts = new Map();
const WINDOW_MS = 60000;
const MAX_ATTEMPTS = 10;
const MAX_CLIENTS = 2048;
const MAX_BODY_BYTES = 2048;

function response(text, status, extra = {}) {
  return new Response(text, { status, headers: { 'Cache-Control': 'no-store', ...extra } });
}

function rateLimit(request) {
  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.until <= now) attempts.delete(key);
  // Cloudflare supplies this header. Never trust X-Forwarded-For as an identity.
  const key = request.headers.get('CF-Connecting-IP') || 'unknown-client';
  let entry = attempts.get(key);
  if (!entry) {
    if (attempts.size >= MAX_CLIENTS) return response('Too many requests', 429, { 'Retry-After': '60' });
    entry = { count: 0, until: now + WINDOW_MS };
    attempts.set(key, entry);
  }
  if (++entry.count > MAX_ATTEMPTS) {
    return response('Too many requests', 429, { 'Retry-After': String(Math.max(1, Math.ceil((entry.until - now) / 1000))) });
  }
  return null;
}

async function readBody(request) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return { error: response('Expected JSON', 415) };
  }
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) {
    return { error: response('Request too large', 413) };
  }
  const reader = request.body?.getReader();
  if (!reader) return { error: response('Bad request', 400) };
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { error: response('Request too large', 413) };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!body || Array.isArray(body) || typeof body.password !== 'string' || body.password.length > 1024) {
      return { error: response('Bad request', 400) };
    }
    return { password: body.password.trim() };
  } catch {
    return { error: response('Bad request', 400) };
  } finally {
    reader.releaseLock();
  }
}

function toBase64Url(bytes) {
  let str = typeof bytes === 'string' ? btoa(bytes) : btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return response('Forbidden', 403);
  const limited = rateLimit(request);
  if (limited) return limited;
  const body = await readBody(request);
  if (body.error) return body.error;
  const submitted = body.password;
  const correct = env.AGENTS_CASE_PASSWORD;
  if (!correct) return response('Server error', 500);
  if (submitted !== correct) return response('Unauthorized', 401);

  const secret = env.AGENTS_COOKIE_SECRET;
  if (!secret) return response('Server error', 500);

  const payload = toBase64Url(JSON.stringify({ area: 'agents', iat: Date.now() }));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const sigB64 = toBase64Url(new Uint8Array(sig));
  const cookieVal = payload + '.' + sigB64;

  return new Response('OK', {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': [
        'agents_auth=' + cookieVal,
        'HttpOnly', 'Secure', 'SameSite=Lax',
        'Path=/', 'Max-Age=604800'
      ].join('; ')
    }
  });
}
