function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return padded + pad;
}

async function verifyHmac(cookieVal, secret) {
  if (!secret) return false;
  try {
    const [payload, sigB64] = cookieVal.split('.');
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

    if (data.area === 'agents' && Date.now() - data.iat > 604800000) return false;
    if (data.area === 'presentation' && Date.now() - data.iat > 43200000) return false;

    return data;
  } catch { return false; }
}

function getCookie(cookieHeader, name) {
  const match = (cookieHeader || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? match[1] : null;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const AGENTS_PATHS = ['/agents', '/agents/', '/agents.html'];
  const AGENTS_PRIVATE_PREFIXES = ['/portfolio%20images/agents/'];
  const PRES_PATHS = [
    '/case-study-presentation/agents-deck',
    '/case-study-presentation/agents-deck/',
    '/case-study-presentation/agents-deck.html'
  ];
  const PRES_PRIVATE_PREFIX = '/case-study-presentation/agents-deck/';

  const cookies = request.headers.get('Cookie') || '';

  const isAgentsPath = AGENTS_PATHS.includes(path)
    || AGENTS_PRIVATE_PREFIXES.some(prefix => path.startsWith(prefix));
  const isPresPath = PRES_PATHS.includes(path) || path.startsWith(PRES_PRIVATE_PREFIX);

  if (isAgentsPath) {
    const token = getCookie(cookies, 'agents_auth');
    if (token) {
      const data = await verifyHmac(token, env.AGENTS_COOKIE_SECRET);
      if (data && data.area === 'agents') return next();
    }
    return Response.redirect(new URL('/agents-locked', request.url).href, 302);
  }

  if (isPresPath) {
    const token = getCookie(cookies, 'pres_auth');
    if (token) {
      const data = await verifyHmac(token, env.PRESENTATION_COOKIE_SECRET);
      if (data && data.area === 'presentation') return next();
    }
    return Response.redirect(new URL('/presentation-locked', request.url).href, 302);
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
