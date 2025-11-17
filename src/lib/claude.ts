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
  wikipediaFacts?: string[];
  popularity?: number;
}): Promise<string> {
  if (!process.env.CLAUDE_API_KEY) {
    return '';
  }

  const audioInfo = trackData.audioFeatures ?
    `**Audio Features:**
- Tempo: ${trackData.audioFeatures.tempo_bpm?.toFixed(0)} BPM
- Key: ${trackData.audioFeatures.key} ${trackData.audioFeatures.mode}
- Energy: ${((trackData.audioFeatures.energy ?? 0) * 100).toFixed(0)}%
- Danceability: ${((trackData.audioFeatures.danceability ?? 0) * 100).toFixed(0)}%` : '';

  const wikipediaContext = trackData.wikipediaFacts && trackData.wikipediaFacts.length > 0 ?
    `**Wikipedia Facts:**
${trackData.wikipediaFacts.slice(0, 6).map(fact => `- ${fact}`).join('\n')}` : '';

  const popularityContext = trackData.popularity !== undefined ?
    `**Spotify Popularity:** ${trackData.popularity}/100` : '';

  const prompt = `You are a knowledgeable music journalist writing a brief, factual insight about this song.

**Song Details:**
- Title: "${trackData.title}"
- Artist(s): ${trackData.artists.join(', ')}
- Album: "${trackData.album}"
- Release Date: ${trackData.release_date}
${popularityContext}

${audioInfo}

${wikipediaContext}

**Your Task:**
Write 1-3 SHORT, SPECIFIC sentences (max 60 words total) that provide interesting musical insights.

**STRICT REQUIREMENTS:**
- Be factual and concrete - reference specific elements from the data above
- NO vague metaphors or flowery language
- NO phrases like "sonic landscape," "ethereal journey," "paints a picture," etc.
- Focus on: musical style, the artist's evolution, cultural context, or technical elements
- Sound like an informed music journalist, not marketing copy
- If you mention influences or genres, be specific

**Good examples:**
- "This was Taylor Swift's breakout single in 2014, marking her transition from country to pop."
- "The track features unconventional 7/4 time signature and blends jazz harmony with electronic production."
- "Released at the height of the grunge movement, this became Nirvana's signature song."

Return ONLY the insight text - no labels, no extra formatting.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text.trim();
    }

    return '';

  } catch (error) {
    console.error('Claude API error:', error);
    return '';
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
