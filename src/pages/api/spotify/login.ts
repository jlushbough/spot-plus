import type { NextApiRequest, NextApiResponse } from 'next';
import { generateCodeVerifier, generateCodeChallenge } from '../../../lib/pkce';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: 'Spotify client ID or redirect URI not configured' });
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Persist the code verifier in a short-lived cookie (15 minutes) for later token exchange
  const cookie = `spotify_pkce_verifier=${encodeURIComponent(codeVerifier)}; Path=/; HttpOnly; Secure; Max-Age=900; SameSite=Lax`;
  res.setHeader('Set-Cookie', cookie);

  const scope = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  const authorizationUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  res.redirect(authorizationUrl);
}