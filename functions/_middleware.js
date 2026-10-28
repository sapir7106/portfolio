function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return padded + pad;
}

async function verifyHmac(cookieVal, secret) {
  if (!secret) return false;
  try {
    const parts = cookieVal.split('.');
    if (parts.length !== 2) return false;
    const [payload, sigB64] = parts;
    if (!payload || !sigB64) return false;
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const sig = Uint8Array.from(atob(fromBase64Url(sigB64)), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify(
      'HMAC', key, sig, new TextEncoder().encode(payload)
    );
    if (!valid) return false;
    const data = JSON.parse(atob(fromBase64Url(payload)));

    const maxAge = { agents: 604800000, presentation: 43200000 }[data?.area];
    if (!maxAge || !Number.isSafeInteger(data.iat) || data.iat > Date.now() + 60000) return false;
    if (Date.now() - data.iat > maxAge) return false;

    return data;
  } catch { return false; }
}

function getCookie(cookieHeader, name) {
  const match = (cookieHeader || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? match[1] : null;
}

function privateResponse(response) {
  const result = new Response(response.body, response);
  result.headers.set('Cache-Control', 'private, no-store');
  result.headers.set('Vary', 'Cookie');
  return result;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  let path;
  try {
    path = decodeURIComponent(url.pathname).replace(/\\/g, '/').replace(/\/{2,}/g, '/');
    // Reject ambiguous nested encodings and decoded traversal before route matching.
    if (/%[0-9a-f]{2}/i.test(path) || path.split('/').some(part => part === '.' || part === '..')) {
      return privateResponse(new Response('Bad request', { status: 400 }));
    }
  } catch {
    return privateResponse(new Response('Bad request', { status: 400 }));
  }

  const AGENTS_PATHS = ['/agents', '/agents/', '/agents.html', '/agents-content.txt'];
  const AGENTS_PRIVATE_PREFIX = '/portfolio images/agents';
  const PRES_PRIVATE_PREFIX = '/case-study-presentation';

  const cookies = request.headers.get('Cookie') || '';

  const isAgentsPath = AGENTS_PATHS.includes(path.replace(/\/+$/, ''))
    || path === AGENTS_PRIVATE_PREFIX || path.startsWith(AGENTS_PRIVATE_PREFIX + '/');
  const isPresPath = path === PRES_PRIVATE_PREFIX || path.startsWith(PRES_PRIVATE_PREFIX + '/');

  if (isAgentsPath) {
    const token = getCookie(cookies, 'agents_auth');
    if (token) {
      const data = await verifyHmac(token, env.AGENTS_COOKIE_SECRET);
      if (data && data.area === 'agents') return privateResponse(await next());
    }
    return privateResponse(Response.redirect(new URL('/agents-locked', request.url).href, 302));
  }

  if (isPresPath) {
    const token = getCookie(cookies, 'pres_auth');
    if (token) {
      const data = await verifyHmac(token, env.PRESENTATION_COOKIE_SECRET);
      if (data && data.area === 'presentation') return privateResponse(await next());
    }
    return privateResponse(Response.redirect(new URL('/presentation-locked', request.url).href, 302));
  }

  if (path === '/agents-locked') {
    const token = getCookie(cookies, 'agents_auth');
    if (token) {
      const data = await verifyHmac(token, env.AGENTS_COOKIE_SECRET);
      if (data && data.area === 'agents') {
        return Response.redirect(new URL('/agents', request.url).href, 302);
      }
    }
  }

  if (path === '/presentation-locked') {
    const token = getCookie(cookies, 'pres_auth');
    if (token) {
      const data = await verifyHmac(token, env.PRESENTATION_COOKIE_SECRET);
      if (data && data.area === 'presentation') {
        return Response.redirect(
          new URL('/case-study-presentation/agents-deck', request.url).href, 302
        );
      }
    }
  }

  return next();
}
