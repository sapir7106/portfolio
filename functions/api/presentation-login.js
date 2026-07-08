function toBase64Url(bytes) {
  let str = typeof bytes === 'string' ? btoa(bytes) : btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try { body = await request.json(); }
  catch { return new Response('Bad request', { status: 400 }); }

  const submitted = (body.password || '').trim();
  const correct = env.PRESENTATION_PASSWORD;
  if (!correct) return new Response('Server error', { status: 500 });
  if (submitted !== correct) return new Response('Unauthorized', { status: 401 });

  const secret = env.PRESENTATION_COOKIE_SECRET;
  if (!secret) return new Response('Server error', { status: 500 });

  const payload = toBase64Url(JSON.stringify({ area: 'presentation', iat: Date.now() }));
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
      'Set-Cookie': [
        'pres_auth=' + cookieVal,
        'HttpOnly', 'Secure', 'SameSite=Lax',
        'Path=/', 'Max-Age=43200'
      ].join('; ')
    }
  });
}
