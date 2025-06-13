/** @type {import('next').NextConfig} */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const nextConfig = {
  webpack: config => {
    config.plugins.push(new MiniCssExtractPlugin());
    return config;
  },
};

export default nextConfig;
