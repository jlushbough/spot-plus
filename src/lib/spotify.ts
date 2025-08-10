import type { NextApiRequest, NextApiResponse } from 'next';

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

/**
 * Exchange an authorization code for an access/refresh token pair using PKCE.
 */
export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string
): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams();
  params.set('client_id', process.env.SPOTIFY_CLIENT_ID as string);
  params.set('grant_type', 'authorization_code');
  params.set('code', code);
  params.set('redirect_uri', process.env.NEXT_PUBLIC_REDIRECT_URI as string);
  params.set('code_verifier', codeVerifier);

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!res.ok) {
    throw new Error('Failed to exchange code for token');
  }
  const data = (await res.json()) as SpotifyTokenResponse;
  return data;
}

/**
 * Refresh an access token using a refresh token. PKCE flows still require the client_id.
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams();
  params.set('client_id', process.env.SPOTIFY_CLIENT_ID as string);
  params.set('grant_type', 'refresh_token');
  params.set('refresh_token', refreshToken);

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!res.ok) {
    throw new Error('Failed to refresh access token');
  }
  const data = (await res.json()) as SpotifyTokenResponse;
  return data;
}

/**
 * Fetch the currently playing track from Spotify. Returns null if nothing is playing.
 */
export async function fetchCurrentlyPlaying(accessToken: string) {
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.status === 204 || res.status === 205) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Failed to fetch current track');
  }
  const data = await res.json();
  return data;
}

/**
 * Fetch the most recently played track from Spotify.
 */
export async function fetchRecentlyPlayed(accessToken: string) {
  const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch recently played track');
  }
  const data = await res.json();
  return data;
}

/**
 * Fetch audio features for a track.
 */
export async function fetchAudioFeatures(accessToken: string, trackId: string) {
  const res = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Audio features not available for track ${trackId}`);
    }
    if (res.status === 403) {
      throw new Error('Insufficient permissions to fetch audio features');
    }
    throw new Error(`Failed to fetch audio features: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}