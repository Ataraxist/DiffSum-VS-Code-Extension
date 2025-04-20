import simpleGit from 'simple-git';
import * as vscode from 'vscode';

export async function getStagedDiff(): Promise<string> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return 'No workspace folder is open.';
  }

  const repoPath = workspaceFolders[0].uri.fsPath;
  const git = simpleGit(repoPath);

  try {
    const diff = await git.diff(['--staged']);
    return diff.trim() || 'No staged changes found.';
  } catch (err: any) {
    return `Failed to get git diff: ${err.message}`;
  }
}
