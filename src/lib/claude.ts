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

  const prompt = `Write an insightful music review of this song with intelligent critical analysis:

**Song Details:**
- Title: "${trackData.title}"
- Artist(s): ${trackData.artists.join(', ')}
- Album: "${trackData.album}"
- Release Date: ${trackData.release_date}

Channel the voice of a sophisticated music critic - thoughtful, perceptive, and nuanced. Provide intelligent analysis that considers:

- The song's place in the artist's catalog and musical evolution
- Technical and compositional elements that make it work (or don't)
- Cultural context and influence
- What the song reveals about the human experience
- Honest assessment of its artistic merit

Be discerning but fair. Recognize genuine craftsmanship when it exists. Point out flaws when they matter. Focus on WHY the song succeeds or fails rather than just declaring it good or bad.

Write with intelligence and insight. 80-120 words of thoughtful music criticism.

Return only the review - make it smart and illuminating.`;

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
