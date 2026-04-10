import type { JSONCrackProps, NodeData } from "jsoncrack-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import jsoncrackStyles from "jsoncrack-react/style.css?inline";
import localStyles from "./content-script.css?inline";

type ThemeMode = "light" | "dark";
type JSONCrackComponentType = (props: JSONCrackProps) => ReactNode;
const NODE_MODAL_BACKDROP_ID = "jsoncrack-node-modal-backdrop";
const GRAPH_OVERLAY_ID = "jsoncrack-graph-overlay";
const TOGGLE_ID = "jsoncrack-toggle";

const getExtensionAssetUrl = (path: string) => {
  const runtime = (
    globalThis as {
      chrome?: { runtime?: { getURL?: (assetPath: string) => string } };
    }
  ).chrome?.runtime;

  return runtime?.getURL?.(path) ?? "";
};

const TO_DIAGRAM_LOGO_URL = getExtensionAssetUrl("icons/logo.svg");

let jsonCrackComponentPromise: Promise<JSONCrackComponentType> | null = null;

const loadJsonCrackComponent = async (): Promise<JSONCrackComponentType> => {
  if (jsonCrackComponentPromise) {
    return jsonCrackComponentPromise;
  }

  jsonCrackComponentPromise = (async () => {
    // ELK (the layout engine used by reaflow) tries to spawn a Web Worker
    // on first use. On JSON pages with a strict `default-src 'none'` CSP,
    // worker creation throws. Temporarily shadow `Worker` for the duration
    // of the import + initial layout so ELK falls back to its sync path,
    // then restore it so the host page's own workers keep working.
    const originalWorker = (globalThis as { Worker?: typeof Worker }).Worker;
    try {
      (globalThis as { Worker?: typeof Worker }).Worker = undefined;
      const mod = await import("jsoncrack-react");
      return mod.JSONCrack as JSONCrackComponentType;
    } finally {
      (globalThis as { Worker?: typeof Worker }).Worker = originalWorker;
    }
  })();

  return jsonCrackComponentPromise;
};

(() => {
  if (window.top !== window) return;
  if (!document.body) return;
  if (document.getElementById(TOGGLE_ID)) return;

  const source = getJsonSource();
  if (!source) return;

  injectStyles();
  injectToggle(source);
})();

function injectStyles() {
  const styleTag = document.createElement("style");
  styleTag.id = "jsoncrack-inline-style";
  styleTag.textContent = `${jsoncrackStyles}\n${localStyles}`;
  document.documentElement.appendChild(styleTag);
}

function getJsonSource() {
  const body = document.body;
  const contentType = (document.contentType || "").toLowerCase();

  const pickText = (): string => {
    if (contentType.includes("json")) {
      return body.innerText || body.textContent || "";
    }
    // Browsers render standalone JSON responses as a single <pre> inside
    // <body>. Some built-in viewers wrap that <pre> in extra containers,
    // so look for exactly one <pre> anywhere in the body.
    const pres = body.querySelectorAll("pre");
    if (pres.length === 1) {
      return pres[0].textContent || "";
    }
    return "";
  };

  const raw = pickText().trim();
  if (!raw) return null;
  if (!startsLikeJson(raw)) return null;

  try {
    JSON.parse(raw);
    return raw;
  } catch {
    return null;
  }
}

function startsLikeJson(value: string) {
  return value.startsWith("{") || value.startsWith("[");
}

function detectTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useSystemTheme(): ThemeMode {
  const [theme, setTheme] = useState<ThemeMode>(detectTheme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return theme;
}

function injectToggle(rawJson: string) {
  const toggleRoot = document.createElement("div");
  toggleRoot.id = TOGGLE_ID;
  toggleRoot.innerHTML = [
    '<div class="jsoncrack-segmented" role="group" aria-label="JSON view mode">',
    '<button class="jsoncrack-toggle-btn is-active" type="button" data-mode="raw" aria-pressed="true">Raw</button>',
    '<button class="jsoncrack-toggle-btn" type="button" data-mode="graph" aria-pressed="false">Graph</button>',
    "</div>",
  ].join("");

  const graphOverlay = document.createElement("div");
  graphOverlay.id = GRAPH_OVERLAY_ID;
  graphOverlay.hidden = true;

  const reactRootContainer = document.createElement("div");
  reactRootContainer.id = "jsoncrack-react-root";
  graphOverlay.appendChild(reactRootContainer);

  const attribution = document.createElement("a");
  attribution.id = "jsoncrack-attribution";
  attribution.href =
    "https://jsoncrack.com/editor?utm_source=jsoncrack&utm_medium=chrome_extension&utm_campaign=attribution";
  attribution.target = "_blank";
  attribution.rel = "noopener noreferrer";
  attribution.textContent = "Powered by JSON Crack";
  graphOverlay.appendChild(attribution);

  document.body.appendChild(graphOverlay);
  document.body.appendChild(toggleRoot);

  const rawButton = toggleRoot.querySelector<HTMLButtonElement>('[data-mode="raw"]');
  const graphButton = toggleRoot.querySelector<HTMLButtonElement>('[data-mode="graph"]');

  if (!rawButton || !graphButton) return;

  let graphRoot: ReturnType<typeof createRoot> | null = null;

  const mountGraphView = () => {
    if (graphRoot) return;

    graphRoot = createRoot(reactRootContainer);
    graphRoot.render(<GraphView rawJson={rawJson} />);
  };

  const unmountGraphView = () => {
    if (!graphRoot) return;
    graphRoot.unmount();
    graphRoot = null;
    reactRootContainer.textContent = "";
  };

  const setMode = (mode: "raw" | "graph") => {
    const isGraph = mode === "graph";

    graphOverlay.hidden = !isGraph;
    rawButton.classList.toggle("is-active", !isGraph);
    graphButton.classList.toggle("is-active", isGraph);
    rawButton.setAttribute("aria-pressed", String(!isGraph));
    graphButton.setAttribute("aria-pressed", String(isGraph));

    if (isGraph) {
      // Wait for the overlay to be laid out before mounting so the graph
      // viewport initializes with the correct container dimensions and
      // centerOnLayout fits the graph correctly.
      window.requestAnimationFrame(() => {
        if (graphOverlay.hidden) return;
        mountGraphView();
      });
    } else {
      unmountGraphView();
    }
  };

  rawButton.addEventListener("click", () => setMode("raw"));
  graphButton.addEventListener("click", () => setMode("graph"));
  window.addEventListener(
    "keydown",
    event => {
      if (event.key !== "Escape") return;
      if (graphOverlay.hidden) return;
      if (document.getElementById(NODE_MODAL_BACKDROP_ID)) return;
      setMode("raw");
    },
    // Use capture so we beat host-page handlers that might stopPropagation.
    true
  );
}

const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj: Record<string, unknown> = {};
  nodeRows.forEach(row => {
    if (row.type !== "array" && row.type !== "object" && row.key) {
      obj[row.key] = row.value;
    }
  });

  return JSON.stringify(obj, null, 2);
};

const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

function NodeModal({ nodeData, onClose }: { nodeData: NodeData | null; onClose: () => void }) {
  const [copiedField, setCopiedField] = useState<"content" | "path" | null>(null);
  const nodeContent = useMemo(() => normalizeNodeData(nodeData?.text ?? []), [nodeData]);
  const jsonPath = useMemo(() => jsonPathToString(nodeData?.path), [nodeData]);

  useEffect(() => {
    if (!nodeData) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };

    window.addEventListener("keydown", onEscape, true);
    return () => {
      window.removeEventListener("keydown", onEscape, true);
    };
  }, [nodeData, onClose]);

  if (!nodeData) return null;

  const handleCopy = async (field: "content" | "path", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField(current => (current === field ? null : current));
      }, 1200);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <div id={NODE_MODAL_BACKDROP_ID} onClick={onClose}>
      <div
        id="jsoncrack-node-modal"
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
      >
        <div className="jsoncrack-node-modal-header">
          <strong>Node Content</strong>
          <button
            type="button"
            className="jsoncrack-node-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="jsoncrack-node-modal-section">
          <div className="jsoncrack-node-modal-row">
            <span>Content</span>
            <button
              type="button"
              className="jsoncrack-node-modal-copy"
              onClick={() => handleCopy("content", nodeContent)}
            >
              {copiedField === "content" ? "Copied" : "Copy"}
            </button>
          </div>
          <pre>{nodeContent}</pre>
        </div>

        <div className="jsoncrack-node-modal-section">
          <div className="jsoncrack-node-modal-row">
            <span>JSON Path</span>
            <button
              type="button"
              className="jsoncrack-node-modal-copy"
              onClick={() => handleCopy("path", jsonPath)}
            >
              {copiedField === "path" ? "Copied" : "Copy"}
            </button>
          </div>
          <pre>{jsonPath}</pre>
        </div>
      </div>
    </div>
  );
}

// NOTE: `rawJson` is captured once at injection time. Single-Page-App JSON
// viewers that swap the payload in place without a full reload won't update
// the graph. That's acceptable for the current target (browser JSON viewers
// on static responses) — revisit if we add SPA support.
function GraphView({ rawJson }: { rawJson: string }) {
  const theme = useSystemTheme();
  const [JSONCrackComponent, setJSONCrackComponent] = useState<JSONCrackComponentType | null>(null);
  const [componentError, setComponentError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  useEffect(() => {
    let active = true;

    loadJsonCrackComponent()
      .then(component => {
        if (!active) return;
        setJSONCrackComponent(() => component);
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load graph renderer.";
        setComponentError(message);
      });

    return () => {
      active = false;
    };
  }, []);

  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(rawJson);
    } catch {
      return null;
    }
  }, [rawJson]);

  if (parsedJson === null) {
    return <div id="jsoncrack-graph-error">JSON parsing failed for graph mode.</div>;
  }

  if (componentError) {
    return <div id="jsoncrack-graph-error">Graph renderer error: {componentError}</div>;
  }

  if (!JSONCrackComponent) {
    return <div id="jsoncrack-graph-status">Loading graph renderer...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <JSONCrackComponent
        json={parsedJson}
        theme={theme}
        showControls
        showGrid
        centerOnLayout
        onNodeClick={node => setSelectedNode(node)}
        renderNodeLimitExceeded={() => <NodeLimitUpgrade />}
      />
      <NodeModal nodeData={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}

function NodeLimitUpgrade() {
  return (
    <div id="jsoncrack-upgrade-overlay">
      <div id="jsoncrack-upgrade-card">
        {TO_DIAGRAM_LOGO_URL ? (
          <img
            src={TO_DIAGRAM_LOGO_URL}
            alt="ToDiagram"
            width={48}
            height={48}
            className="jsoncrack-upgrade-logo"
          />
        ) : null}
        <span className="jsoncrack-upgrade-badge">Upgrade Required</span>
        <h2 className="jsoncrack-upgrade-title">Your diagram is too large</h2>
        <p className="jsoncrack-upgrade-desc">
          JSON Crack can&apos;t render this file.{" "}
          <a
            href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=chrome_extension&utm_campaign=data_limit"
            target="_blank"
            rel="noopener noreferrer"
            className="jsoncrack-upgrade-link"
          >
            ToDiagram
          </a>{" "}
          handles large datasets with ease.
        </p>
        <a
          href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=chrome_extension&utm_campaign=data_limit&modal=upgrade&format=json&example=true"
          target="_blank"
          rel="noopener noreferrer"
          className="jsoncrack-upgrade-cta"
        >
          Continue with ToDiagram →
        </a>
      </div>
    </div>
  );
}
