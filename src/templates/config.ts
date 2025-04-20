// Import the VS Code API to access user and workspace configuration settings
import * as vscode from 'vscode';

// Define and export a function that retrieves user-configured values for DiffSum
export function getConfig() {
  // Access the settings namespace for this extension (e.g., "diffsum.apiKey")
  const settings = vscode.workspace.getConfiguration('diffsum');

  // Read the 'verbose' setting (boolean); default to false if undefined
  const verbose = settings.get<boolean>('verbose') ?? false;

  // Read the 'apiKey' setting (string); default to an empty string if undefined
  const apiKey = settings.get<string>('apiKey') ?? '';

  // Return a configuration object containing:
  return {
    // The OpenAI API key to use for requests
    apiKey,

    // The model to use: GPT-4 if verbose is enabled, GPT-3.5 otherwise
    model: verbose ? 'gpt-4' : 'gpt-3.5-turbo',

    // Token limit for the OpenAI response: larger for verbose mode
    maxTokens: verbose ? 250 : 100,

    // System prompt given to the AI to define its behavior and output style
    systemPrompt: verbose
      ? `You are an AI that writes **detailed Git commit messages** in a structured format.

Follow these rules:

1. **Subject (First Line)**
  - Use Conventional Commits format (e.g., feat:, fix:, chore:, refactor:, docs:, style:, test:, perf:, ci:).
  - Describe all changes detected in the diff file.
  - Use the imperative mood (e.g., 'Add feature' instead of 'Added feature').
  - Clearly describe what the change does.

2. **Body (Detailed Summary)**
  - Explain all changes in detail.
  - Include affected files and functions.
  - Describe the reasoning behind changes.
  - Wrap lines at 80 characters.
  - Format for readability.

**Example Format:**
feat: refactor authentication flow

- Moved login validation logic to \`authService.js\`
- Improved error handling for invalid credentials.
- Standardized response format for failed logins.
- Updated documentation to reflect API changes.`
      : `You are an AI that writes **concise Git commit messages** in a structured format.

Follow these rules:

1. **Subject (First Line)**
  - Use Conventional Commits format (e.g., feat:, fix:, chore:, refactor:, docs:, style:, test:, perf:, ci:).
  - Use the imperative mood (e.g., 'Add feature' instead of 'Added feature').
  - Clearly describe what the change does.

2. **Body (Optional, After a Blank Line)**
  - Add additional context if necessary.
  - Explain why the change was made.
  - Use bullet points for clarity if listing multiple changes.
  - Wrap lines at 80 characters.

**Example Format:**
feat: improve login validation

- Ensure password length validation matches frontend policy.
- Improve error messages for incorrect login attempts.
- Refactor validation logic for reusability.`,
  };
}
