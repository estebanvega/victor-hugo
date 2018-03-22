const webpack = require("webpack");
const path = require("path");
const shellPlugin = require("webpack-shell-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const hugoCmd = "hugo -d ../dist -s site -v";
const hugoCmdPreview = "hugo --source site --buildDrafts --buildFuture";

module.exports = (env, argv) => {
  return {
    context: __dirname,
    entry: {
      app: ["./src/js/app.js"]
    },
    module: {
      rules: [
        {
          test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader?name=/[hash].[ext]"
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: "css-loader", options: {importLoaders: 1}},
            "postcss-loader"
          ]
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
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css"
      }),
      new webpack.ProvidePlugin({
        fetch:
          "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
      }),
      new shellPlugin({
        onBuildEnd: [argv.mode === "production" ? hugoCmd : hugoCmdPreview]
      })
    ],

    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: "[name].js"
    },
    externals: [/^vendor\/.+\.js$/]
  };
};
