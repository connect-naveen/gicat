const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  components: "src/**/*.vue",
  defaultExample: true,
  styleguideDir: "styleguide-dist",
  ignore: [
    "dist_electron/**",
    "dist/**",
    "node_modules/**",
    "build/**",
    ".github/**",
  ],
  webpackConfig: (env) => {
    const config = require("@vue/cli-service/webpack.config.js");
    config.plugins = config.plugins.filter(
      (plugin) => !(plugin instanceof HtmlWebpackPlugin)
    );
    return config;
  },
};
