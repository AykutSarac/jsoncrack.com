import * as path from "path";
import * as vscode from "vscode";
import { createWebviewPanel } from "./webview";

function getPanelTitle(document?: vscode.TextDocument) {
  if (!document) return "JSON Crack";

  const fileName = path.basename(document.fileName);
  return fileName || "JSON Crack";
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("jsoncrack-vscode.start", () =>
      createWebviewForActiveEditor(context)
    ),
    vscode.commands.registerCommand("jsoncrack-vscode.start.specific", (content?: string) =>
      createWebviewForContent(context, content)
    ),
    vscode.commands.registerCommand("jsoncrack-vscode.start.selected", () =>
      createWebviewForSelectedText(context)
    )
  );
}

// create webview for selected text
async function createWebviewForSelectedText(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (editor && editor.selection.isEmpty) {
    vscode.window.showInformationMessage("Please select some text first!");
    return;
  }

  const selectedText = editor?.document.getText(editor.selection);

  // Create the webview panel and send the selected JSON content
  const panel = createWebviewPanel(context, getPanelTitle(editor?.document));
  panel.webview.postMessage({
    json: selectedText,
  });

  const onReceiveMessage = panel.webview.onDidReceiveMessage(e => {
    if (e === "ready") {
      panel.webview.postMessage({
        json: selectedText,
      });
    }
  });

  const onTextChange = vscode.workspace.onDidChangeTextDocument(changeEvent => {
    if (changeEvent.document === editor?.document) {
      panel.webview.postMessage({
        json: changeEvent.document.getText(editor?.selection),
      });
    }
  });

  const disposer = () => {
    onTextChange.dispose();
    onReceiveMessage.dispose();
  };

  panel.onDidDispose(disposer, null, context.subscriptions);
}

async function createWebviewForActiveEditor(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  const panel = createWebviewPanel(context, getPanelTitle(editor?.document));

  const onReceiveMessage = panel.webview.onDidReceiveMessage(e => {
    if (e === "ready") {
      panel.webview.postMessage({
        json: editor?.document.getText(),
      });
    }
  });

  const onTextChange = vscode.workspace.onDidChangeTextDocument(changeEvent => {
    if (changeEvent.document === editor?.document) {
      panel.webview.postMessage({
        json: changeEvent.document.getText(),
      });
    }
  });

  const disposer = () => {
    onTextChange.dispose();
    onReceiveMessage.dispose();
  };

  panel.onDidDispose(disposer, null, context.subscriptions);
}

/**
 * Renders a readonly diagram from a string
 * @param context ExtensionContext
 * @param content JSON content as a string
 */
function createWebviewForContent(context?: vscode.ExtensionContext, content?: string): any {
  if (context && content) {
    const panel = createWebviewPanel(
      context,
      getPanelTitle(vscode.window.activeTextEditor?.document)
    );
    panel.webview.postMessage({
      json: content,
    });
  }
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
