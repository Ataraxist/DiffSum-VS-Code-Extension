import * as vscode from 'vscode';
import { getStagedDiff } from './utils/git.js';
import { generateCommitMessage } from './utils/openai.js';

export async function activate(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    console.log('Git extension not found.');
    return;
  }

  const gitApi = await gitExtension.activate().then(() => gitExtension.exports.getAPI(1));
  const repo = await waitForRepo(gitApi);

  if (!repo) {
    console.log('Still no Git repository after polling 5s.');
    return;
  }

  // Register the button-triggered command
  const disposable = vscode.commands.registerCommand('diffsum.generateCommit', async () => {
    const userInput = repo.inputBox.value.trim();

    if (userInput.length > 0) {
      vscode.window.showInformationMessage('Commit box already filled. Clear it first for an AI version.');
      return;
    }

    const diff = await getStagedDiff();

    if (!diff || diff.length === 0) {
      vscode.window.showWarningMessage('No valid diff to summarize.');
      return;
    }

    const message = await generateCommitMessage(diff);

    if (message) {
      repo.inputBox.value = message;
      vscode.window.showInformationMessage('Commit message generated.');
    } else {
      vscode.window.showErrorMessage('Failed to generate commit message.');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function waitForRepo(gitApi: any, timeout = 5000): Promise<any | null> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (gitApi.repositories.length > 0) {
      return gitApi.repositories[0];
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}
