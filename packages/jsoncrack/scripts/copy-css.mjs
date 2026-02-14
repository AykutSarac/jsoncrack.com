import { mkdir, readdir, stat, copyFile, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const packageDir = path.resolve(scriptDir, "..");
const SRC_DIR = path.join(packageDir, "src");
const DIST_DIR = path.join(packageDir, "dist");
const IMPORT_SPECIFIER_RE = /(from\s+["'])(\.{1,2}\/[^"']+)(["'])/g;
const DYNAMIC_IMPORT_SPECIFIER_RE = /(import\(\s*["'])(\.{1,2}\/[^"']+)(["']\s*\))/g;

const needsJsExtension = (specifier) => {
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) return false;
  return !/\.(js|mjs|cjs|css|json)$/.test(specifier);
};

const ensureJsExtension = (specifier) =>
  needsJsExtension(specifier) ? `${specifier}.js` : specifier;

const copyCssFiles = async (dirPath) => {
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await copyCssFiles(sourcePath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".module.css")) {
      continue;
    }

    const relativePath = path.relative(SRC_DIR, sourcePath);
    const destinationPath = path.join(DIST_DIR, relativePath);
    const destinationDir = path.dirname(destinationPath);

    await mkdir(destinationDir, { recursive: true });
    await copyFile(sourcePath, destinationPath);
  }
};

const patchJsImports = async (dirPath) => {
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const targetPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await patchJsImports(targetPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".js")) {
      continue;
    }

    const fileContent = await readFile(targetPath, "utf-8");

    const patched = fileContent
      .replace(IMPORT_SPECIFIER_RE, (_full, start, specifier, end) => {
        return `${start}${ensureJsExtension(specifier)}${end}`;
      })
      .replace(
        DYNAMIC_IMPORT_SPECIFIER_RE,
        (_full, start, specifier, end) => {
          return `${start}${ensureJsExtension(specifier)}${end}`;
        },
      );

    if (patched !== fileContent) {
      await writeFile(targetPath, patched);
    }
  }
};

const run = async () => {
  const stats = await stat(SRC_DIR);
  if (!stats.isDirectory()) return;
  await copyCssFiles(SRC_DIR);
  await patchJsImports(DIST_DIR);
};

run().catch(error => {
  console.error("Failed to copy CSS modules:", error);
  process.exit(1);
});
