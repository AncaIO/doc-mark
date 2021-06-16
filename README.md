# DocMark

DocMark is an application for editing Markdown files from your local filesystem. 

## Features
- Markdown editor with preview. Thanks, [@barelyhuman](https://github.com/barelyhuman/), for the simple and elegant solution of your [Mark editor](https://github.com/barelyhuman/mark). 
- Recursively matches files of a specific format in a directory. You can just open a large project. It excludes `node_module` markdown files. 
- Since the editor is based on a simple `<textarea>`, browser extensions like Grammarly or ProWritingAid work. 
- Saving the edited markdown in the browser updates the local file. 

## Using the app

1. [Download](https://nodejs.org/en/download/) and install Node.js if you don't have it on your machine. Update it to the latest long-term support (LTS) version if already installed.
2. Clone this repository locally. 
3. Using a terminal, change the directory to the root of this repository. 
4. In the terminal, run `npm install`. 
5. Create a file called `.env`, and provide values for the following variables:
  
  | Variable | Value (example) | Description|
  | --- | --- | --- |
  | `NEXT_PUBLIC_DOCS_READ_PATH` | `C:\Users\me\Projects\doc-mark`|The absolute path to the folder with documents. |
  | `NEXT_PUBLIC_DOCS_UNIX_PATH` | `C:/Users/ance/Projects/doc-mark/` |The absolute path to the folder with documents UNIX style. Note the closing `/`. On a UNIX system, the same value as `NEXT_PUBLIC_DOCS_READ_PATH` with an extra backslash at the end. |
  | `NEXT_PUBLIC_DOCS_FORMAT` | `.md` | The format of the files you want to edit. Theoretically, you could use this editor for any plain text format, but the preview feature will give you no value. |    
  
  > Example: 
  >   ```
  >   NEXT_PUBLIC_DOCS_READ_PATH=C:\Users\me\Projects\doc-mark
  >   NEXT_PUBLIC_DOCS_UNIX_PATH=C:/Users/ance/Projects/doc-mark/
  >   NEXT_PUBLIC_DOCS_FORMAT=.md
  >   ```
  
6. From the front page of the application, click the link to the document you want to edit.
8. Make your changes to the document.
9. Click the **Save File** button. 

## Limitations
- NO AUTOSAVE.
- The editor does not (yet!) have keyboard shortcuts for formatting or saving.
- If you change the `.env` file, you **must** restart the application from the terminal to read the new values into the environment.
- Although the app can read very large document sets, the limit really depends on your machine. I've successfully used the application with over 100 documents, but no more. Up to you to try more than that BUT keep in mind that all those documents will be listed on the front page. This is far from ideal because:
    - the app does not have pagination for the documents (yet!). 
    - the app does not have search functionality (yet!). 
- You need to install browser extensions for the spelling and grammar checkers you want to use and get subscriptions as needed. This app only allows these extensions to work as intended. 

## Roadmap
[] Add keyboard shortcuts for common actions: save*, bold, italic.

[] Add search support. 

[] Add pagination or incremental loading. 

[] Refine the look of the UI (better code samples) or provide the ability to use external CSS for closer-to-production styling. 

## Contributions welcome!

To contribute, fork this repo, make and **document** your changes. Create a pull request.
