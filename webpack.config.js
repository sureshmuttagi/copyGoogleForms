const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/, // Ensure SCSS is processed properly
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/pages/dashboard.html", to: "dashboard.html" },
        { from: "src/pages/listing.html", to: "listing.html" },
        { from: "src/pages/preview.html", to: "preview.html" },
        { from: "src/pages/form.html", to: "form.html" },
        { from: "src/styles/styles.scss", to: "styles.css" },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
  mode: "development",
};
