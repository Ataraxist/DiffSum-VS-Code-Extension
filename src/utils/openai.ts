import OpenAI from 'openai';
import { getConfig } from '../templates/config';

export async function generateCommitMessage(diff: string): Promise<string> {
  const { apiKey, model, systemPrompt, maxTokens } = getConfig();

  if (!apiKey || !apiKey.startsWith('sk-')) {
    return 'OpenAI API key is missing or invalid.';
  }

  const openai = new OpenAI({ apiKey });

  try {
    const chat = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: diff },
      ],
      max_tokens: maxTokens,
    });

    return chat.choices[0].message.content?.trim() ?? 'No message returned.';
  } catch (error: any) {
    return `OpenAI error: ${error.message}`;
  }
}
