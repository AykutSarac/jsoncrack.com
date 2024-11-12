import type { EditorProps } from "@monaco-editor/react";

export const editorOptions: EditorProps["options"] = {
  formatOnPaste: true,
  stopRenderingLineAfter: -1,
  minimap: { enabled: false },
  stickyScroll: { enabled: false },
  scrollBeyondLastLine: false,
};
