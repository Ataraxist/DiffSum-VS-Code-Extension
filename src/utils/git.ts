// Import the simple-git library for running Git commands via JavaScript
import simpleGit from 'simple-git';

// Import the VS Code API to access the user's workspace folders
import * as vscode from 'vscode';

// Export an async function that returns the diff of currently staged changes
export async function getStagedDiff(): Promise<string> {
  // Get the list of currently open workspace folders in VS Code
  const workspaceFolders = vscode.workspace.workspaceFolders;

  // If no folder is open in the editor, return a friendly error message
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return 'No workspace folder is open.';
  }

  // Use the path of the first workspace folder as the root of the Git repo
  const repoPath = workspaceFolders[0].uri.fsPath;

  // Initialize the simple-git client, pointing to the repo directory
  const git = simpleGit(repoPath);

  try {
    // Run 'git diff --staged' to get the diff for currently staged changes
    const diff = await git.diff(['--staged']);

    // Return the trimmed diff, or a fallback message if the diff is empty
    return diff.trim() || 'No staged changes found.';
  } catch (err: any) {
    // Catch and report errors (e.g., if Git is not available or fails)
    return `Failed to get git diff: ${err.message}`;
  }
}
