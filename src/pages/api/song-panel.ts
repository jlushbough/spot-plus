import { NextApiRequest, NextApiResponse } from 'next';
import { generateTrackEnrichment, analyzeWikipediaContent } from '../../lib/claude';
import { generateBandInformation } from '../../lib/band-info';
import { generateHeaviestLyrics } from '../../lib/heaviest-lyrics';
import { getWikipediaContentForSong } from '../../lib/wikipedia';

interface TrackFact {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
}

interface SongStory {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
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
  song_story: SongStory;
  heaviest_lyrics: HeaviestLyrics;
  band_info: BandInfo;
  interesting_facts: InterestingFacts;
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

// Generate track facts with source attribution - simplified to just popularity
function generateTrackFacts(data: any): TrackFact[] {
  const facts: TrackFact[] = [];
  const stats = data.track_stats || data.stats;

  // Popularity (from Spotify)
  if (stats?.popularity !== undefined) {
    facts.push({
      text: formatPopularity(stats.popularity),
      source: 'spotify',
      confidence: 'high'
    });
  }

  return facts;
}

// Generate band information using LLM
async function generateBandInfo(data: any): Promise<BandInfo> {
  const { track_core } = data;
  const stats = data.track_stats || data.stats;
  const artist = track_core?.artists?.[0] || '';
  
  // Try to get band info from LLM first
  try {
    const bandContent = await generateBandInformation(artist);
    
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
  const { track_core } = data;
  const stats = data.track_stats || data.stats;
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

async function generateInterestingFacts(data: any): Promise<InterestingFacts> {
  const { track_core } = data;

  try {
    // Try to get Wikipedia content for the song first, then artist
    const wikiData = await getWikipediaContentForSong(
      track_core.title,
      track_core.artists[0],
      track_core.album
    );

    if (wikiData) {
      // Use AI to analyze and extract interesting facts
      const facts = await analyzeWikipediaContent({
        wikipediaContent: wikiData.content,
        source: wikiData.source,
        title: track_core.title,
        artist: track_core.artists[0],
        wikiTitle: wikiData.title,
      });

      if (facts.length > 0) {
        return { facts };
      }
    }
  } catch (error) {
    console.error('Error generating Wikipedia facts:', error);
  }

  // Fallback to basic facts if Wikipedia fails
  const facts: string[] = [
    `Released: ${new Date(track_core.release_date).getFullYear()}`,
    `Featured on "${track_core.album}"`,
    'No Wikipedia information available for this track'
  ];

  return { facts: facts.slice(0, 5) };
}
async function generateSongStory(data: any): Promise<SongStory> {
  const { track_core } = data;
  const stats = data.track_stats || data.stats;
  
  try {
    // Use the existing Claude integration to generate a real story
    const llmContent = await generateTrackEnrichment({
      title: track_core.title,
      artists: track_core.artists,
      album: track_core.album,
      release_date: track_core.release_date,
    });
    
    // Extract just the story part from the markdown, remove headers and formatting
    let story = llmContent
      .replace(/^#.*$/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    // Take first paragraph or limit to reasonable length
    const sentences = story.split('.').filter(s => s.trim().length > 10);
    if (sentences.length > 4) {
      story = sentences.slice(0, 4).join('.') + '.';
    }
    
    // Ensure it's not too long (60-110 words target)
    const words = story.split(' ').filter(w => w.length > 0);
    if (words.length > 110) {
      story = words.slice(0, 110).join(' ') + '...';
    }
    
    return {
      text: story,
      source: 'llm',
      confidence: 'high'
    };
    
  } catch (error) {
    console.error('Error generating LLM story:', error);
    
    // Fallback to basic thematic analysis when LLM fails
    let fallbackStory = `${track_core?.title || 'This track'} explores themes central to ${track_core?.artists?.[0] || 'the artist'}'s work.`;
    
    if (track_core?.album) {
      fallbackStory += ` From "${track_core.album}", it represents their perspective on key issues or experiences.`;
    }
    
    if (stats?.artist_info?.[0]?.genres?.length) {
      const genre = stats.artist_info[0].genres[0];
      fallbackStory += ` The lyrics reflect typical ${genre} themes and concerns.`;
    } else {
      fallbackStory += ` The song's message resonates through its direct lyrical approach.`;
    }
    
    return {
      text: fallbackStory,
      source: 'llm',
      confidence: 'low'
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  
  if (!data.track_core) {
    return res.status(400).json({ error: 'track_core is required' });
  }

  try {
    const panelData: PanelData = {
      artist_header: data.track_core.artists?.[0] || 'Unknown Artist',
      track_facts: generateTrackFacts(data),
      song_story: await generateSongStory(data),
      heaviest_lyrics: {
        text: await generateHeaviestLyrics({
          title: data.track_core.title,
          artists: data.track_core.artists,
          album: data.track_core.album,
          release_date: data.track_core.release_date
        }),
        source: 'llm',
        confidence: 'high'
      },
      band_info: await generateBandInfo(data),
      interesting_facts: await generateInterestingFacts(data)
    };

    res.status(200).json(panelData);
  } catch (error) {
    console.error('Error generating panel data:', error);
    res.status(500).json({ error: 'Failed to generate panel data' });
  }
}
