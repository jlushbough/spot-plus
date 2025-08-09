import type { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCodeForToken } from '../../../lib/spotify';

function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((pair) => {
    const [name, ...rest] = pair.trim().split('=');
    if (!name) return;
    cookies[name] = decodeURIComponent(rest.join('='));
  });
  return cookies;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }
  const { code, error } = req.query as { code?: string; error?: string };
  if (error) {
    return res.status(400).send(`Authorization error: ${error}`);
  }
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  const cookies = parseCookieHeader(req.headers.cookie);
  const codeVerifier = cookies['spotify_pkce_verifier'];
  if (!codeVerifier) {
    return res.status(400).send('PKCE code verifier not found');
  }

  try {
    const tokenData = await exchangeCodeForToken(code, codeVerifier);
    const refreshToken = tokenData.refresh_token;
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;

    // Build cookies to set: clear PKCE, set refresh token, set access token & expiry
    const cookiesToSet: string[] = [];
    // Clear PKCE verifier
    cookiesToSet.push(`spotify_pkce_verifier=; Path=/; HttpOnly; Max-Age=0; Secure; SameSite=Lax`);
    // Set refresh token cookie if present
    if (refreshToken) {
      cookiesToSet.push(
        `spotify_refresh_token=${encodeURIComponent(refreshToken)}; Path=/; HttpOnly; Secure; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
      );
    }
    // Set access token and expiry cookies (non-HttpOnly so client can refresh quickly)
    cookiesToSet.push(
      `spotify_access_token=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${expiresIn}; Secure; SameSite=Lax`
    );
    cookiesToSet.push(
      `spotify_token_expires=${Date.now() + expiresIn * 1000}; Path=/; Max-Age=${expiresIn}; Secure; SameSite=Lax`
    );
    res.setHeader('Set-Cookie', cookiesToSet);

    // Redirect to the app root
    return res.redirect('/');
  } catch (err: any) {
    console.error(err);
    return res.status(500).send('Failed to exchange code for token');
  }
}