import { mkdir, readdir, stat, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const packageDir = path.resolve(scriptDir, "..");
const SRC_DIR = path.join(packageDir, "src");
const DIST_DIR = path.join(packageDir, "dist");

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

const run = async () => {
  const stats = await stat(SRC_DIR);
  if (!stats.isDirectory()) return;
  await copyCssFiles(SRC_DIR);
};

run().catch(error => {
  console.error("Failed to copy CSS modules:", error);
  process.exit(1);
});
