# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Spotify Companion App" - a Next.js application that integrates with Spotify to display enhanced information about currently playing tracks. The app uses Spotify's PKCE authentication flow and enriches track data with AI-generated content from Anthropic's Claude API.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

## Architecture

### Authentication Flow
The app uses Spotify's PKCE (Proof Key for Code Exchange) authentication:
- Login initiated at `/api/spotify/login`
- Callback handled at `/api/spotify/callback` 
- PKCE utilities in `src/lib/pkce.ts`
- Token management in `src/lib/spotify.ts`

### Core Data Flow
1. **Track Fetching**: `/api/spotify/current` fetches currently playing track from Spotify API
2. **Song Enrichment**: `/api/song-panel` generates enhanced content using Claude API
3. **Caching**: In-memory cache (`src/lib/cache.ts`) stores Claude-generated content for 30 minutes
4. **Smart Polling**: Frontend polls at different intervals (30s when playing, 2m when paused, 5m when no track)

### Key Components
- **Main UI**: `src/pages/index.tsx` - Two-pane layout showing track info and enhanced content
- **API Routes**: 
  - `src/pages/api/spotify/*` - Spotify integration endpoints
  - `src/pages/api/song-panel.ts` - Claude content generation
- **Libraries**:
  - `src/lib/spotify.ts` - Spotify API client functions
  - `src/lib/claude.ts` - Claude API integration for track reviews
  - `src/lib/cache.ts` - In-memory caching layer

### Environment Variables Required
- `SPOTIFY_CLIENT_ID` - Spotify app client ID
- `NEXT_PUBLIC_REDIRECT_URI` - OAuth callback URL
- `CLAUDE_API_KEY` - Anthropic API key for content generation

### Data Structure
The app processes tracks through multiple enrichment stages:
- **TrackCore**: Basic track metadata from Spotify
- **AudioFeatures**: Technical audio analysis data
- **EnrichmentData**: Combined Spotify + Claude-generated content
- **PanelData**: Structured content for the right panel (facts, band info, reviews)

## TypeScript Configuration
- Strict mode enabled
- Path aliasing: `@/*` maps to `./src/*`
- JSX preserve mode for Next.js