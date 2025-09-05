
import { simpleLLMCompletion } from './openai';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

// ...existing code...
  export async function generateBandInformation(artistName: string): Promise<{
    content: string;
    usage: any;
    model: string | null;
    provider: string;
  }> {
    const prompt = `Provide factual information about the band/artist: ${artistName}

  Return in this exact format:
  Members: [list the main band members, or "Solo artist" if solo]
  Formed: [year formed]
  Origin: [city, country]
  Facts: [2-3 key notable facts about the band/artist]

  Be concise and factual. Focus on the most important members and facts.`;

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
        content: `Band information for ${artistName} unavailable - API key not configured`,
        usage: null,
        model: null,
        provider: 'none'
      };
    }
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
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
        content: `Band information for ${artistName} temporarily unavailable`,
        usage: null,
        model: 'claude-3-haiku-20240307',
        provider: 'claude'
      };
    } catch (error) {
      console.error('Claude API error for band info:', error);
      return {
        content: `Band information for ${artistName} temporarily unavailable`,
        usage: null,
        model: 'claude-3-haiku-20240307',
        provider: 'claude'
      };
    }
  }
