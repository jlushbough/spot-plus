import type { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCurrentlyPlaying,
  fetchRecentlyPlayed,
  fetchAudioFeatures,
  refreshAccessToken,
} from '../../../lib/spotify';

interface TrackCore {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
  duration_ms: number;
  isrc: string | null;
  spotify_track_id: string;
  cover_url: string;
}

interface AudioFeatures {
  tempo_bpm: number;
  key: string;
  mode: 'major' | 'minor';
  energy: number;
  danceability: number;
  valence: number;
}

interface EnrichmentData {
  track_core: TrackCore;
  audio_features: AudioFeatures;
  credits: any;
  performance: any;
  critical: any;
  similar_recos: any;
  sidebar_markdown: string;
}

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

function keyFromInt(k: number): string {
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return keys[k] ?? 'C';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookieHeader(req.headers.cookie);
  let accessToken = cookies['spotify_access_token'];
  const refreshToken = cookies['spotify_refresh_token'];
  const expiresAt = cookies['spotify_token_expires'] ? parseInt(cookies['spotify_token_expires']) : 0;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Check if access token is expired or near expiry
  const now = Date.now();
  if (expiresAt && now >= expiresAt - 60 * 1000) {
    try {
      const tokenData = await refreshAccessToken(refreshToken);
      accessToken = tokenData.access_token;
      const newExpiresAt = Date.now() + tokenData.expires_in * 1000;
      // Set new access token cookies
      const cookiesToSet: string[] = [];
      cookiesToSet.push(
        `spotify_access_token=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${tokenData.expires_in}; Secure; SameSite=Lax`
      );
      cookiesToSet.push(
        `spotify_token_expires=${newExpiresAt}; Path=/; Max-Age=${tokenData.expires_in}; Secure; SameSite=Lax`
      );
      res.setHeader('Set-Cookie', cookiesToSet);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Failed to refresh token' });
    }
  }

  try {
    // Try to get currently playing track
    let currentlyPlaying = await fetchCurrentlyPlaying(accessToken);
    let recent = false;
    if (!currentlyPlaying || !currentlyPlaying.item) {
      // Fallback to most recently played
      const recentlyPlayed = await fetchRecentlyPlayed(accessToken);
      if (recentlyPlayed.items && recentlyPlayed.items.length > 0) {
        currentlyPlaying = recentlyPlayed.items[0];
        recent = true;
      }
    }
    if (!currentlyPlaying || !currentlyPlaying.item) {
      return res.status(204).end();
    }
    const item = currentlyPlaying.item;
    const trackCore: TrackCore = {
      title: item.name,
      artists: item.artists.map((a: any) => a.name),
      album: item.album?.name ?? '',
      release_date: item.album?.release_date ?? '',
      duration_ms: item.duration_ms,
      isrc: item.external_ids?.isrc ?? null,
      spotify_track_id: item.id,
      cover_url: item.album?.images?.[0]?.url ?? '',
    };

    // Fetch audio features
    let audioFeaturesRaw = null;
    try {
      audioFeaturesRaw = await fetchAudioFeatures(accessToken, item.id);
    } catch (err) {
      console.warn('Audio features unavailable', err);
    }
    const audioFeatures: AudioFeatures = {
      tempo_bpm: audioFeaturesRaw?.tempo ?? 0,
      key: audioFeaturesRaw ? keyFromInt(audioFeaturesRaw.key) : 'C',
      mode: audioFeaturesRaw?.mode === 1 ? 'major' : 'minor',
      energy: audioFeaturesRaw?.energy ?? 0,
      danceability: audioFeaturesRaw?.danceability ?? 0,
      valence: audioFeaturesRaw?.valence ?? 0,
    };

    const result: EnrichmentData = {
      track_core: trackCore,
      audio_features: audioFeatures,
      credits: {},
      performance: {},
      critical: {},
      similar_recos: [],
      sidebar_markdown: recent
        ? `Last played track **${trackCore.title}** by **${trackCore.artists.join(', ')}**.`
        : `Currently playing **${trackCore.title}** by **${trackCore.artists.join(', ')}**.`,
    };
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch track information' });
  }
}