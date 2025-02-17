const path = require("path")

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`

module.exports = {
  "src/**/*.{js,jsx,ts,tsx}": [buildEslintCommand],
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --apply --no-errors-on-unmatched", // Format, sort imports, lint, and apply safe fixes
  ],
}
