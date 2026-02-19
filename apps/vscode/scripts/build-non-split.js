#!/usr/bin/env node

const path = require("path");
const rewire = require("rewire");
const defaults = rewire("react-scripts/scripts/build.js");
let config = defaults.__get__("config");

// Disable source maps
config.devtool = false;

// Disable code splitting
config.optimization.splitChunks = {
  cacheGroups: {
    default: false
  }
};

config.optimization.runtimeChunk = false;

// Enable tree shaking
config.optimization.usedExports = true;

// Force a single React instance in the bundle. Without this, workspace-linked
// packages can resolve a different React version and break hooks at runtime.
config.resolve.alias = {
  ...(config.resolve.alias || {}),
  react: path.resolve(__dirname, "../node_modules/react"),
  "react-dom": path.resolve(__dirname, "../node_modules/react-dom")
};

config.resolve.plugins = (config.resolve.plugins || []).filter(
  (plugin) => plugin.constructor.name !== "ModuleScopePlugin"
);

// Ensure production optimizations are enabled
config.mode = 'production';
config.optimization.minimize = true;

// Allow extensionless imports from ESM dependencies.
config.module.rules.push({
  test: /\.m?js$/,
  resolve: {
    fullySpecified: false
  }
});
