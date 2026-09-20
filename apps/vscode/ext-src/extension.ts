import * as path from "path";
import * as vscode from "vscode";
import { createWebviewPanel } from "./webview";

function getPanelTitle(document?: vscode.TextDocument) {
  if (!document) return "JSON Crack";

  const fileName = path.basename(document.fileName);
  return fileName || "JSON Crack";
}

// Detect the input format from the file extension. Falls back to JSON when
// the format is unknown or the document isn't YAML/JSON.
function getFileFormat(fileName: string): "json" | "yaml" {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".yaml" || ext === ".yml") return "yaml";
  return "json";
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
  const format = getFileFormat(editor?.document.fileName ?? "");

  // Create the webview panel and send the selected content
  const panel = createWebviewPanel(context, getPanelTitle(editor?.document));
  panel.webview.postMessage({
    json: selectedText,
    format,
  });

  const onReceiveMessage = panel.webview.onDidReceiveMessage(e => {
    if (e === "ready") {
      panel.webview.postMessage({
        json: selectedText,
        format,
      });
    }
  });

  const onTextChange = vscode.workspace.onDidChangeTextDocument(changeEvent => {
    if (changeEvent.document === editor?.document) {
      panel.webview.postMessage({
        json: changeEvent.document.getText(editor?.selection),
        format,
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
  const format = getFileFormat(editor?.document.fileName ?? "");

  const onReceiveMessage = panel.webview.onDidReceiveMessage(e => {
    if (e === "ready") {
      panel.webview.postMessage({
        json: editor?.document.getText(),
        format,
      });
    }
  });

  const onTextChange = vscode.workspace.onDidChangeTextDocument(changeEvent => {
    if (changeEvent.document === editor?.document) {
      panel.webview.postMessage({
        json: changeEvent.document.getText(),
        format,
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
    const format = getFileFormat(vscode.window.activeTextEditor?.document.fileName ?? "");
    const panel = createWebviewPanel(
      context,
      getPanelTitle(vscode.window.activeTextEditor?.document)
    );
    panel.webview.postMessage({
      json: content,
      format,
    });
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
