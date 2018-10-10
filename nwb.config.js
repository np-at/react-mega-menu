const path = require("path");

module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: false
  },

  webpack: {
    extra: {
      devtool: "source-map",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loaders: [
              "istanbul-instrumenter-loader", // for code coverage
              "awesome-typescript-loader" // for typescript itself
            ],
            exclude: /node_modules/
          },
          {
            test: /.js$/,
            loader: "source-map-loader",
            enforce: "pre"
          }
        ]
      }
    }
  }
};
