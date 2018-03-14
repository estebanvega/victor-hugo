const webpack = require("webpack");
const path = require("path");
const shellPlugin = require("webpack-shell-plugin");

const hugoCommand = "hugo -d ../dist -s site -v";

module.exports = (env, argv) => {
  return {
    context: path.resolve(__dirname, "src"),
    entry: {
      app: ["./js/app.js"]
    },
    module: {
      rules: [
        {
          test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader?name=/[hash].[ext]"
        },
        {test: /\.json$/, loader: "json-loader"},
        {
          loader: "babel-loader",
          test: /\.js?$/,
          exclude: /node_modules/,
          query: {cacheDirectory: true}
        }
      ]
    },

    plugins: [
      new webpack.ProvidePlugin({
        fetch:
          "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
      }),
      new shellPlugin({onBuildEnd: [hugoCommand]})
    ],

    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: "[name].js"
    },
    externals: [/^vendor\/.+\.js$/]
  };
};
