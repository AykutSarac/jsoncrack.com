import { applyEdits, modify } from "jsonc-parser";

const FORMATTING = { formattingOptions: { tabSize: 2, insertSpaces: true } } as any;

type Patch = { displayName?: string; color?: string };

/**
 * Upsert _styles[nodeId] with provided fields and timestamps.
 * Keeps createdAt if it already exists.
 */
export function updateJsonStyles(jsonStr: string, nodeId: string, patch: Patch): string {
  let text = jsonStr ?? "{}";

  // Best-effort parse to detect whether _styles/nodeId exists to preserve createdAt
  let exists = false;
  try {
    const parsed = JSON.parse(text);
    exists = !!(parsed && parsed._styles && Object.prototype.hasOwnProperty.call(parsed._styles, nodeId));
  } catch (err) {
    // fall back to modifying directly if parse fails
    exists = false;
  }

  // 1) Ensure _styles exists as an object
  let edits = modify(text, ["_styles"], {}, FORMATTING);
  if (edits.length) text = applyEdits(text, edits);

  const now = new Date().toISOString();

  if (!exists) {
    // Insert whole entry including createdAt
    const newEntry = {
      ...(patch.displayName ? { displayName: patch.displayName } : {}),
      ...(patch.color ? { color: patch.color } : {}),
      createdAt: now,
      updatedAt: now,
    } as any;

    const insertEdits = modify(text, ["_styles", nodeId], newEntry, FORMATTING);
    if (insertEdits.length) return applyEdits(text, insertEdits);
  }

  // If exists, update fields individually and updatedAt
  const updates: Record<string, any> = { ...(patch.displayName !== undefined ? { displayName: patch.displayName } : {}), ...(patch.color !== undefined ? { color: patch.color } : {}), updatedAt: now };
  let after = text;
  for (const [k, v] of Object.entries(updates)) {
    const fieldEdits = modify(after, ["_styles", nodeId, k], v, FORMATTING);
    if (fieldEdits.length) after = applyEdits(after, fieldEdits);
  }

  return after;
}

export default updateJsonStyles;
