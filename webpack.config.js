// webpack.config.js

const path = require("path");

module.exports = {
  entry: "./src/index.ts", // Your entry file
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
    library: "goodday-sdk",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"],
    alias: {
      node_modules: false,
      stories: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
