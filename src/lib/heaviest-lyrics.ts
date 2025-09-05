
import { simpleLLMCompletion } from './openai';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

export async function generateHeaviestLyrics(trackData: {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
}): Promise<{
  content: string;
  usage: any;
  model: string | null;
  provider: string;
}> {
  const prompt = `Analyze the emotional themes and impact of this song:

**Song Details:**
- Title: "${trackData.title}"
- Artist(s): ${trackData.artists.join(', ')}
- Album: "${trackData.album}"
- Release Date: ${trackData.release_date}

Describe the most emotionally powerful themes and messages in this song without quoting lyrics. Focus on:
- The emotional core and central themes
- What makes this song impactful
- The mood and atmosphere it creates

Provide a 2-3 sentence analysis of the song's emotional weight and thematic content.`;

  // Try OpenAI GPT-4o first for speed
  try {
    const openaiResult = await simpleLLMCompletion(prompt, 'gpt-4o');
    if (openaiResult && openaiResult.content && openaiResult.content.length > 10) {
      return {
        content: openaiResult.content,
        usage: openaiResult.usage,
        model: openaiResult.model || 'gpt-4o',
        provider: 'openai'
      };
    }
  } catch (err) {
    // fallback to Claude
  }

  // Fallback to Claude if OpenAI fails or not configured
  if (!process.env.CLAUDE_API_KEY) {
    return {
      content: `Heaviest lyrics for ${trackData.title} unavailable - API key not configured`,
      usage: null,
      model: null,
      provider: 'none'
    };
  }
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });
    const content = response.content[0];
    if (content.type === 'text') {
      return {
        content: content.text,
        usage: null,
        model: 'claude-3-haiku-20240307',
        provider: 'claude'
      };
    }
    return {
      content: `Heaviest lyrics for ${trackData.title} temporarily unavailable`,
      usage: null,
      model: 'claude-3-haiku-20240307',
      provider: 'claude'
    };
  } catch (error) {
    console.error('Claude API error for heaviest lyrics:', error);
    return {
      content: `Heaviest lyrics for ${trackData.title} temporarily unavailable`,
      usage: null,
      model: 'claude-3-haiku-20240307',
      provider: 'claude'
    };
  }
}
