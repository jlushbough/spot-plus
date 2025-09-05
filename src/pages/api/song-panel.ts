import { NextApiRequest, NextApiResponse } from 'next';
import { generateEnhancedReview, EnhancedReview } from '../../lib/claude';
import { generateBandInformation } from '../../lib/band-info';
import { generateHeaviestLyrics } from '../../lib/heaviest-lyrics';
import { getCachedContent, setCachedContent } from '../../lib/cache';

interface TrackFact {
  text: string;
  source: 'spotify' | 'llm' | 'database';
  confidence: 'high' | 'medium' | 'low';
}

interface SongwriterInfo {
  writers: string[];
  producer?: string;
  background: string;
  source: 'known' | 'inferred' | 'unknown';
}

interface SongStory {
  text: string;
  themes: string[];
  meaning: string;
  cultural_context: string;
  source: 'spotify' | 'llm' | 'analysis';
  confidence: 'high' | 'medium' | 'low';
}

interface CriticalReview {
  verdict: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  source: 'critical_analysis';
}

interface HeaviestLyrics {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
}

interface BandInfo {
  members: string[];
  formation_year?: string;
  origin?: string;
  notable_facts: string[];
}

interface InterestingFacts {
  facts: string[];
}

interface PanelData {
  artist_header: string;
  track_facts: TrackFact[];
  songwriter_info: SongwriterInfo;
  song_story: SongStory;
  critical_review: CriticalReview;
  heaviest_lyrics: HeaviestLyrics;
  band_info: BandInfo;
  interesting_facts: InterestingFacts;
  sources_attribution: string;
}

// Format duration to mm:ss
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// Map popularity to percentile
function formatPopularity(popularity: number): string {
  return `Top ~${popularity}% on Spotify`;
}

// Generate track facts with enhanced source attribution
function generateTrackFacts(data: any, enhancedReview?: EnhancedReview): TrackFact[] {
  const facts: TrackFact[] = [];
  const { track_core, stats } = data;
  
  // Duration (from Spotify API)
  if (track_core?.duration_ms) {
    facts.push({
      text: `Duration: ${formatDuration(track_core.duration_ms)}`,
      source: 'spotify',
      confidence: 'high'
    });
  }
  
  // Release year (from Spotify metadata)
  if (track_core?.release_date) {
    const year = new Date(track_core.release_date).getFullYear();
    facts.push({
      text: `Released: ${year}`,
      source: 'spotify', 
      confidence: 'high'
    });
  }
  
  // Popularity (from Spotify metrics)
  if (stats?.popularity !== undefined) {
    facts.push({
      text: formatPopularity(stats.popularity),
      source: 'spotify',
      confidence: 'high'
    });
  }
  
  // Album type (from Spotify catalog)
  if (stats?.album_type) {
    facts.push({
      text: `Album type: ${stats.album_type}`,
      source: 'spotify',
      confidence: 'high'
    });
  }

  // Producer information from enhanced review (research-based)
  if (enhancedReview?.songwriter_info.producer) {
    facts.push({
      text: `Producer: ${enhancedReview.songwriter_info.producer}`,
      source: enhancedReview.songwriter_info.source === 'known' ? 'database' : 'llm',
      confidence: enhancedReview.songwriter_info.source === 'known' ? 'high' : 
                  enhancedReview.songwriter_info.source === 'inferred' ? 'medium' : 'low'
    });
  }
  
  // Markets available (from Spotify distribution data)
  if (stats?.markets_available > 100) {
    facts.push({
      text: `Available in ${stats.markets_available} markets`,
      source: 'spotify',
      confidence: 'high'
    });
  }
  
  return facts.slice(0, 6); // Limit to essential facts
}

// Generate band information using LLM
async function generateBandInfo(data: any): Promise<BandInfo> {
  const { track_core, stats } = data;
  const artist = track_core?.artists?.[0] || '';
  
  // Try to get band info from LLM first
  try {
    const bandResult = await generateBandInformation(artist);
    const bandContent = bandResult.content;
    
    // Parse the LLM response to extract structured data
    const lines = bandContent.split('\n').filter(line => line.trim());
    let bandInfo: BandInfo = {
      members: [],
      notable_facts: []
    };
    
    for (const line of lines) {
      const cleanLine = line.replace(/\*\*/g, '').trim();
      if (cleanLine.toLowerCase().includes('members:')) {
        const membersText = cleanLine.replace(/.*members:\s*/i, '');
        if (membersText.toLowerCase().includes('solo artist')) {
          bandInfo.members = [artist];
        } else {
          bandInfo.members = membersText.split(',').map(m => m.trim()).slice(0, 5);
        }
      } else if (cleanLine.toLowerCase().includes('formed:')) {
        bandInfo.formation_year = cleanLine.replace(/.*formed:\s*/i, '');
      } else if (cleanLine.toLowerCase().includes('origin:')) {
        bandInfo.origin = cleanLine.replace(/.*origin:\s*/i, '');
      } else if (cleanLine.toLowerCase().includes('facts:')) {
        const factsText = cleanLine.replace(/.*facts:\s*/i, '');
        bandInfo.notable_facts = factsText.split('.').filter(f => f.trim()).map(f => f.trim()).slice(0, 3);
      }
    }
    
    // Fallback to hardcoded data if LLM parsing fails
    if (bandInfo.members.length === 0) {
      return generateHardcodedBandInfo(data);
    }
    
    return bandInfo;
    
  } catch (error) {
    console.error('Error generating LLM band info:', error);
    return generateHardcodedBandInfo(data);
  }
}

// Fallback hardcoded band information
function generateHardcodedBandInfo(data: any): BandInfo {
  const { track_core, stats } = data;
  const artist = track_core?.artists?.[0]?.toLowerCase() || '';
  
  // Default structure
  let bandInfo: BandInfo = {
    members: [],
    notable_facts: []
  };
  
  // Add specific band member info for well-known artists
  if (artist.includes('beatles')) {
    bandInfo = {
      members: ['John Lennon', 'Paul McCartney', 'George Harrison', 'Ringo Starr'],
      formation_year: '1960',
      origin: 'Liverpool, England',
      notable_facts: [
        'Best-selling music act of all time',
        'Disbanded in 1970 after 10 years together',
        'Revolutionized popular music and culture'
      ]
    };
  } else if (artist.includes('pink floyd')) {
    bandInfo = {
      members: ['David Gilmour', 'Roger Waters', 'Nick Mason', 'Richard Wright'],
      formation_year: '1965',
      origin: 'London, England',
      notable_facts: [
        'Pioneers of progressive rock',
        'Known for elaborate live shows',
        '"The Dark Side of the Moon" spent 14 years on Billboard 200'
      ]
    };
  } else if (artist.includes('radiohead')) {
    bandInfo = {
      members: ['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood', 'Ed O\'Brien', 'Philip Selway'],
      formation_year: '1985',
      origin: 'Abingdon, England',
      notable_facts: [
        'Evolved from alternative rock to experimental electronic',
        'Released "In Rainbows" using pay-what-you-want model',
        'Known for innovative use of technology in music'
      ]
    };
  } else if (artist.includes('nirvana')) {
    bandInfo = {
      members: ['Kurt Cobain', 'Krist Novoselic', 'Dave Grohl'],
      formation_year: '1987',
      origin: 'Aberdeen, Washington',
      notable_facts: [
        'Brought grunge and alternative rock to mainstream',
        '"Nevermind" knocked Michael Jackson off #1',
        'Band ended with Kurt Cobain\'s death in 1994'
      ]
    };
  } else if (artist.includes('led zeppelin')) {
    bandInfo = {
      members: ['Robert Plant', 'Jimmy Page', 'John Paul Jones', 'John Bonham'],
      formation_year: '1968',
      origin: 'London, England',
      notable_facts: [
        'One of the most influential rock bands',
        'Pioneers of heavy metal and hard rock',
        'Fourth highest-selling album band in US history'
      ]
    };
  } else {
    // Generic band info based on available data
    if (track_core?.artists) {
      bandInfo.members = track_core.artists.slice(0, 4); // Limit to main members
    }
    
    if (stats?.artist_info?.[0]?.genres?.length) {
      const genre = stats.artist_info[0].genres[0];
      bandInfo.notable_facts.push(`Known for their ${genre} style`);
    }
    
    // Add a generic fact about the current album
    if (track_core?.album && stats?.album_type) {
      bandInfo.notable_facts.push(`"${track_core.album}" is a ${stats.album_type}`);
    }
  }
  
  return bandInfo;
}

function generateInterestingFacts(data: any): InterestingFacts {
  const { track_core, stats } = data;
  const facts: string[] = [];
  
  // Add chart performance if high popularity
  if (stats?.popularity > 70) {
    facts.push(`This track has high popularity (${stats.popularity}/100) on Spotify`);
  }
  
  // Add album context
  if (track_core?.album && track_core?.release_date) {
    const year = new Date(track_core.release_date).getFullYear();
    facts.push(`Featured on "${track_core.album}" (${year})`);
  }
  
  // Add genre information
  if (stats?.artist_info?.[0]?.genres?.length) {
    const genres = stats.artist_info[0].genres.slice(0, 2).join(' and ');
    facts.push(`Classified as ${genres} music`);
  }
  
  // Add follower count if significant
  if (stats?.artist_info?.[0]?.followers && stats.artist_info[0].followers > 1000000) {
    const followers = Math.round(stats.artist_info[0].followers / 1000000);
    facts.push(`Artist has ${followers}M+ followers on Spotify`);
  }
  
  // Add markets info
  if (stats?.markets_available > 100) {
    facts.push(`Available in ${stats.markets_available} countries worldwide`);
  }
  
  // Ensure we have at least a few facts
  if (facts.length < 3) {
    facts.push(`Duration: ${Math.round(track_core?.duration_ms / 1000 / 60 * 100) / 100} minutes`);
    if (stats?.album_type) {
      facts.push(`Part of a ${stats.album_type} release`);
    }
  }
  
  return { facts: facts.slice(0, 5) }; // Limit to 5 facts
}
// Convert enhanced review to structured song story
function createSongStory(enhancedReview: EnhancedReview): SongStory {
  return {
    text: enhancedReview.thematic_analysis.songMeaning,
    themes: enhancedReview.thematic_analysis.primaryThemes,
    meaning: enhancedReview.thematic_analysis.songMeaning,
    cultural_context: enhancedReview.thematic_analysis.culturalContext,
    source: 'analysis',
    confidence: 'high'
  };
}

// Convert enhanced review to critical assessment
function createCriticalReview(enhancedReview: EnhancedReview): CriticalReview {
  return {
    verdict: enhancedReview.critical_review.verdict,
    rating: enhancedReview.critical_review.rating,
    strengths: enhancedReview.critical_review.strengths,
    weaknesses: enhancedReview.critical_review.weaknesses,
    source: 'critical_analysis'
  };
}

// Convert enhanced review to songwriter info
function createSongwriterInfo(enhancedReview: EnhancedReview): SongwriterInfo {
  return {
    writers: enhancedReview.songwriter_info.writers,
    producer: enhancedReview.songwriter_info.producer,
    background: enhancedReview.songwriter_info.writerBackground,
    source: enhancedReview.songwriter_info.source
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const data = req.body;
  
  if (!data.track_core) {
    return res.status(400).json({ success: false, error: 'track_core is required' });
  }

  const trackId = data.track_core.spotify_track_id;
  const cacheKey = `panel_${trackId}`;

  try {
    // Check cache first
    const cachedContent = getCachedContent(cacheKey);
    if (cachedContent) {
      console.log(`Using cached panel data for track ${trackId}`);
      return res.status(200).json({ success: true, data: JSON.parse(cachedContent) });
    }

    console.log(`Generating new panel data for track ${trackId}`);
    
    // Generate enhanced review with songwriter info, themes, and critical analysis
    const enhancedReview = await generateEnhancedReview({
      title: data.track_core.title,
      artists: data.track_core.artists,
      album: data.track_core.album,
      release_date: data.track_core.release_date,
      audioFeatures: data.audio_features
    });

    const panelData: PanelData = {
      artist_header: data.track_core.artists?.[0] || 'Unknown Artist',
      track_facts: generateTrackFacts(data, enhancedReview),
      songwriter_info: createSongwriterInfo(enhancedReview),
      song_story: createSongStory(enhancedReview),
      critical_review: createCriticalReview(enhancedReview),
      heaviest_lyrics: {
        text: (await generateHeaviestLyrics({
          title: data.track_core.title,
          artists: data.track_core.artists,
          album: data.track_core.album,
          release_date: data.track_core.release_date
        })).content,
        source: 'llm',
        confidence: 'high'
      },
      band_info: await generateBandInfo(data),
      interesting_facts: generateInterestingFacts(data),
      sources_attribution: `Sources: Spotify API (track data, popularity), Music Database (songwriter credits), Critical Analysis (themes, opinion). ${enhancedReview.sources_note}`
    };

    // Cache the generated panel data
    setCachedContent(cacheKey, JSON.stringify(panelData));

    res.status(200).json({ success: true, data: panelData });
  } catch (error) {
    console.error('Error generating panel data:', error);
    res.status(500).json({ success: false, error: 'Failed to generate panel data' });
  }
}
