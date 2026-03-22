import * as path from "path";
import * as vscode from "vscode";

export function createWebviewPanel(context: vscode.ExtensionContext, title = "JSON Crack") {
  const extPath = context.extensionPath;
  const webviewDir = vscode.Uri.file(path.join(extPath, "build", "webview"));

  const panel = vscode.window.createWebviewPanel(
    "liveHTMLPreviewer",
    title,
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [webviewDir, vscode.Uri.file(path.join(extPath, "assets"))],
    }
  );
  panel.iconPath = vscode.Uri.file(path.join(extPath, "assets", "jsoncrack.png"));

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(extPath, "build", "webview", "index.js"))
  );
  const styleUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(extPath, "build", "webview", "index.css"))
  );

  const nonce = getNonce();
  const csp = [
    `default-src 'self' ${panel.webview.cspSource} blob:`,
    `connect-src ${panel.webview.cspSource} blob:`,
    `script-src 'unsafe-eval' 'unsafe-inline' ${panel.webview.cspSource}`,
    `style-src ${panel.webview.cspSource} 'unsafe-inline'`,
    `worker-src ${panel.webview.cspSource} blob: data:`,
  ].join("; ");

  panel.webview.html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Security-Policy" content="${csp}">
        <link href="${styleUri}" rel="stylesheet">
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;

  return panel;
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
