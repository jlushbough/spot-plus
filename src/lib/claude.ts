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

export async function analyzeWikipediaContent(params: {
  wikipediaContent: string;
  source: 'song' | 'artist' | 'album';
  title: string;
  artist: string;
  wikiTitle: string;
}): Promise<string[]> {
  if (!process.env.CLAUDE_API_KEY) {
    return [
      'Wikipedia content available but AI analysis requires API key configuration',
      'Raw facts from Wikipedia can still be displayed'
    ];
  }

  // Limit content to first 3000 characters to stay within token limits
  const truncatedContent = params.wikipediaContent.slice(0, 3000);

  const prompt = `You are analyzing Wikipedia content about ${params.source === 'song' ? 'a song' : params.source === 'album' ? 'an album' : 'an artist'}.

**Context:**
- Current Song: "${params.title}" by ${params.artist}
- Wikipedia Page: "${params.wikiTitle}"
- Content Type: ${params.source}

**Wikipedia Content:**
${truncatedContent}

**Your Task:**
Extract 4-6 of the MOST INTERESTING and SURPRISING facts from this Wikipedia content. Focus on:
- Fascinating trivia and little-known details
- Cultural impact and influence
- Chart performance and critical reception
- Recording stories and production details
- Historical context and legacy
- Awards and recognition

Make each fact compelling and engaging. Write in a casual, conversational tone that makes people say "wow, I didn't know that!"

Return ONLY a JSON array of fact strings, like this:
["fact 1", "fact 2", "fact 3", "fact 4"]

NO additional text, NO markdown formatting, JUST the JSON array.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        // Parse the JSON array from Claude's response
        const facts = JSON.parse(content.text.trim());
        if (Array.isArray(facts) && facts.length > 0) {
          return facts.slice(0, 6);
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract facts manually
        const lines = content.text.split('\n').filter(line => line.trim().length > 20);
        return lines.slice(0, 5).map(line =>
          line.replace(/^[-*•]\s*/, '').replace(/^"\s*/, '').replace(/\s*"$/, '').trim()
        );
      }
    }

    return [
      `Information about ${params.wikiTitle} is available`,
      'AI analysis temporarily unavailable'
    ];

  } catch (error) {
    console.error('Claude Wikipedia analysis error:', error);
    return [
      `Information sourced from Wikipedia page: ${params.wikiTitle}`,
      'AI-powered insights temporarily unavailable'
    ];
  }
}
