/** @typedef {import('webpack').Configuration} WebpackConfig **/

const webpack = require("webpack");
const path = require("path");

/** @type WebpackConfig */
const extensionConfig = {
  target: "node",
  mode: "none",
  entry: "./ext-src/extension.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
	},
  externals: {
    vscode: "commonjs vscode",
  },
  module: {
		rules: [{
			test: /\.ts$/,
			exclude: [/node_modules/],
			use: [{
				loader: 'ts-loader'
			}]
		}]
	},
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // disable chunks by default since web extensions must be a single bundle
    }),
    new webpack.ProvidePlugin({
      process: "process/browser", // provide a shim for the global `process` variable
    }),
  ],
  devtool: "nosources-source-map",
  performance: {
		hints: false
	},
  infrastructureLogging: {
    level: "log",
  },
};

module.exports = extensionConfig;
