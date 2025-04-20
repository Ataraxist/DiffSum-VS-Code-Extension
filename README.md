# DiffSum — AI-Powered Commit Message Generator for VS Code

DiffSum is a Visual Studio Code extension that uses the OpenAI API to generate structured, conventional Git commit messages based on your staged changes. It is designed to streamline the commit process for developers who want clear, consistent messaging with minimal effort.

## Features

- Generates commit messages from staged Git diffs
- Follows the Conventional Commits format
- Uses OpenAI (GPT-3.5 by default, GPT-4 optional)
- Adds a button to the Source Control panel for one-click usage
- Does not overwrite manually written commit messages
- Configurable through the VS Code settings UI

## Setup

1. Install this extension from the Visual Studio Code Marketplace
2. Open a Git-enabled workspace in VS Code
3. Navigate to **Settings → Extensions → DiffSum**
4. Paste your OpenAI API key
5. (Optional) Enable verbose mode to use GPT-4 for more detailed messages (A bit slower, but significantly more detailed.)

## Usage

1. Stage your changes in the Source Control view
2. Click the "Generate Commit Message" button in the Source Control title bar
3. The extension will insert a generated commit message into the commit input box
4. You may edit or accept the message and proceed with committing

If a commit message is already present, DiffSum will not override it.

## Configuration Options

| Setting             | Description                                                   |
|---------------------|---------------------------------------------------------------|
| `diffsum.apiKey`    | Your OpenAI API key                                           |
| `diffsum.verbose`   | Enable GPT-4 for longer and more detailed commit summaries     |

You can access these settings in the standard VS Code Settings interface under the "DiffSum" section.

## Example Output

```
feat: improve login validation

- Ensure password length matches frontend requirements
- Improve error messages for failed login attempts
- Refactor validation logic into reusable functions
```

## API Key Storage and Security

Your OpenAI API key is stored securely in your local VS Code settings. It is not committed to version control and is not transmitted anywhere other than OpenAI’s API endpoint. Users are responsible for managing and rotating their keys according to OpenAI’s API key guidelines.

## Requirements

- A valid OpenAI API key
- A Git-enabled workspace in Visual Studio Code

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with improvements or feature suggestions.

## License

MIT License  