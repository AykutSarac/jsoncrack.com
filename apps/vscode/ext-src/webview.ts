import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function createWebviewPanel(context: vscode.ExtensionContext, title = "JSON Crack") {
  const extPath = context.extensionPath;

  const panel = vscode.window.createWebviewPanel(
    "liveHTMLPreviewer",
    title,
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(extPath, "build")),
        vscode.Uri.file(path.join(extPath, "build", "static")),
        vscode.Uri.file(path.join(extPath, "build", "static", "js")),
        vscode.Uri.file(path.join(extPath, "build", "static", "css")),
        vscode.Uri.file(path.join(extPath, "assets")),
      ],
    }
  );
  panel.iconPath = vscode.Uri.file(path.join(extPath, "build", "assets", "favicon.ico"));

  const manifest = JSON.parse(
    fs.readFileSync(path.join(extPath, "build", "asset-manifest.json"), "utf-8")
  );

  const mainScript = manifest.files["main.js"];
  const mainStyle = manifest.files["main.css"];

  const scriptPathOnDisk = vscode.Uri.file(path.join(extPath, "build", mainScript));
  const stylePathOnDisk = vscode.Uri.file(path.join(extPath, "build", mainStyle));

  const stylesMainUri = panel.webview.asWebviewUri(stylePathOnDisk);
  const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

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
        <base href="${panel.webview.asWebviewUri(vscode.Uri.file(path.join(extPath, "build")))}/">
        <meta http-equiv="Content-Security-Policy" content="${csp}">
        <link href="${stylesMainUri}" rel="stylesheet">
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
