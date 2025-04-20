// Import the OpenAI SDK (v4)
import OpenAI from 'openai';

// Import the function that loads settings from the user's VS Code config
import { getConfig } from '../templates/config';

// Export a function that takes a Git diff string and returns a commit message
export async function generateCommitMessage(diff: string): Promise<string> {
  // Retrieve user settings: OpenAI API key, model name, prompt, and max token count
  const { apiKey, model, systemPrompt, maxTokens } = getConfig();

  // Validate the API key: must exist and begin with 'sk-' (OpenAI format)
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return 'OpenAI API key is missing or invalid.';
  }

  // Initialize the OpenAI client with the user's API key
  const openai = new OpenAI({ apiKey });

  try {
    // Call the OpenAI Chat Completion API with:
    // - the system prompt (rules and formatting)
    // - the user's Git diff as the message content
    // - the selected model and max token length
    const chat = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: diff }            
      ],
      max_tokens: maxTokens,                       
    });

    // Return the model's response as a trimmed string, or a fallback if it's empty
    return chat.choices[0].message.content?.trim() ?? 'No message returned.';
  } catch (error: any) {
    // Catch API or network errors and return them as a string for display
    return `OpenAI error: ${error.message}`;
  }
}
