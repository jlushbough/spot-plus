import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function simpleLLMCompletion(prompt: string, model: string = 'gpt-4o') {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant for music metadata and summaries.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 512,
    temperature: 0.3,
  });
  return {
    content: response.choices[0].message?.content?.trim() || '',
    usage: response.usage || null,
    model: response.model || model
  };
}
