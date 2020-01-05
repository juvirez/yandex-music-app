const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: { hotkeys: "./src/renderer/hotkeys/index.js" },
  output: {
    path: path.join(__dirname, "src/renderer/compiled")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  mode: "production",
  target: "electron-renderer"
};
