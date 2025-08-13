import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

export async function generateBandInformation(artistName: string): Promise<string> {
  if (!process.env.CLAUDE_API_KEY) {
    return `Band information for ${artistName} unavailable - API key not configured`;
  }

  const prompt = `Provide factual information about the band/artist: ${artistName}

Return in this exact format:
Members: [list the main band members, or "Solo artist" if solo]
Formed: [year formed]
Origin: [city, country]
Facts: [2-3 key notable facts about the band/artist]

Be concise and factual. Focus on the most important members and facts.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    
    return `Band information for ${artistName} temporarily unavailable`;
    
  } catch (error) {
    console.error('Claude API error for band info:', error);
    return `Band information for ${artistName} temporarily unavailable`;
  }
}
