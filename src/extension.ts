// Import VS Code API module
import * as vscode from 'vscode';
// Import helper to get the staged git diff
import { getStagedDiff } from './utils/git.js';
// Import helper that calls OpenAI to generate the commit message
import { generateCommitMessage } from './utils/openai.js';

// This function is called when the extension is activated by VS Code
export async function activate(context: vscode.ExtensionContext) {
  // Try to access the built-in Git extension
  const gitExtension = vscode.extensions.getExtension('vscode.git');

  // If Git isn't available (somehow), log and exit early
  if (!gitExtension) {
    console.log('Git extension not found.');
    return;
  }

  // Activate the Git extension and retrieve the Git API (v1)
  const gitApi = await gitExtension.activate().then(() => gitExtension.exports.getAPI(1));

  // Wait up to 5 seconds for a Git repo to appear in the workspace
  const repo = await waitForRepo(gitApi);

  // If no repository is found after polling, exit gracefully
  if (!repo) {
    console.log('Still no Git repository after polling 5s.');
    return;
  }

  // Register the extension's main command with VS Code
  // This command will be triggered by clicking the button in the Source Control view
  const disposable = vscode.commands.registerCommand('diffsum.generateCommit', async () => {
    // Read the current contents of the commit message input box
    const userInput = repo.inputBox.value.trim();

    // If the user has already typed a message, do not overwrite it
    if (userInput.length > 0) {
      vscode.window.showInformationMessage('Commit box already filled. Clear it first for an AI version.');
      return;
    }

    // Get the current staged Git diff (via CLI)
    const diff = await getStagedDiff();

    // If there's no diff or it's invalid, warn the user
    if (!diff || diff.length === 0) {
      vscode.window.showWarningMessage('No valid diff to summarize.');
      return;
    }

    // Send the diff to OpenAI and get a commit message back
    const message = await generateCommitMessage(diff);

    // If a valid message was returned, set it as the commit message
    if (message) {
      repo.inputBox.value = message;
      vscode.window.showInformationMessage('Commit message generated.');
    } else {
      // Otherwise, show an error notification
      vscode.window.showErrorMessage('Failed to generate commit message.');
    }
  });

  // Register the command in the extension’s cleanup context so it's removed on deactivate
  context.subscriptions.push(disposable);
}

// This function is required by VS Code; it's called when the extension is deactivated
export function deactivate() {}

// This helper waits for a Git repository to become available (polls every 250ms up to 5s)
async function waitForRepo(gitApi: any, timeout = 5000): Promise<any | null> {
  const start = Date.now();

  // Continue checking for a repo until the timeout is reached
  while (Date.now() - start < timeout) {
    if (gitApi.repositories.length > 0) {
      // Return the first available repo
      return gitApi.repositories[0];
    }

    // Wait 250ms before checking again
    await new Promise((r) => setTimeout(r, 250));
  }

  // If no repo was found within the timeout, return null
  return null;
}
