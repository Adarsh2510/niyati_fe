const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  webpack: config => {
    config.plugins.push(new MiniCssExtractPlugin());

    return config;
  },
};
