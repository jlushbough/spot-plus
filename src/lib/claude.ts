import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

export async function generateTrackEnrichment(trackData: {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
  audioFeatures?: {
    tempo_bpm?: number;
    key?: string;
    mode?: 'major' | 'minor';
    energy?: number;
    danceability?: number;
    valence?: number;
  };
}): Promise<string> {
  if (!process.env.CLAUDE_API_KEY) {
    return `# ${trackData.title}

**Artist**: ${trackData.artists.join(', ')}  
**Album**: ${trackData.album}  
**Released**: ${trackData.release_date}

*Claude enrichment unavailable - API key not configured*`;
  }

  const audioInfo = trackData.audioFeatures ? 
    `\n**Audio Features:**
- Tempo: ${trackData.audioFeatures.tempo_bpm?.toFixed(0)} BPM
- Key: ${trackData.audioFeatures.key} ${trackData.audioFeatures.mode}` : '';

  const prompt = `You are a music historian. Provide meaningful information about this song in markdown format.

**Song Details:**
- Title: "${trackData.title}"
- Artist(s): ${trackData.artists.join(', ')}
- Album: "${trackData.album}"
- Release Date: ${trackData.release_date}

Start with 2-3 sentences about what this song means - its emotional core, themes, or message.

Then provide factual context covering:
1. **Story** - Inspiration, writing process, what motivated its creation
2. **Impact** - Cultural significance, influence on other artists, memorable moments
3. **Legacy** - How it's remembered, why it matters

Keep it under 150 words. Focus on meaning and cultural impact rather than technical details.

Return only the markdown content.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    
    return `# ${trackData.title}\n\n**Artist**: ${trackData.artists.join(', ')}\n**Album**: ${trackData.album}\n**Released**: ${trackData.release_date}\n\n*Unable to generate enrichment content*`;
    
  } catch (error) {
    console.error('Claude API error:', error);
    return `# ${trackData.title}

**Artist**: ${trackData.artists.join(', ')}  
**Album**: ${trackData.album}  
**Released**: ${trackData.release_date}${audioInfo}

*Claude enrichment temporarily unavailable*`;
  }
}
