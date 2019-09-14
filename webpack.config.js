const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: { hotkeys: "./src/renderer/hotkeys/index.js" },
  output: {
    path: path.join(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  mode: "production"
};
