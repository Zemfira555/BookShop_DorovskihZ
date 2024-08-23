const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Путь к исходному файлу
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/, // Для шрифтов
        type: 'asset/resource',
        generator: {
          filename: 'font/[name][hash][ext][query]', // Путь для шрифтов в dist
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Путь к HTML-шаблону
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/images/placeholder.png', to: 'images/placeholder.png' }, // Копирование placeholder.png
        { from: 'src/images/png', to: 'images/png' }, // Копирование изображений PNG
        { from: 'src/images/svg', to: 'images/svg' },
        { from: 'src/apple-touch-icon.png', to: 'apple-touch-icon.png' },
        { from: 'src/favicon.ico', to: 'favicon.ico' },
        { from: 'src/icon-192.png', to: 'icon-192.png' },
        { from: 'src/icon-512.png', to: 'icon-512.png' },
        { from: 'src/manifest.webmanifest', to: 'manifest.webmanifest' },
        { from: 'src/tableau.json', to: 'tableau.json' },
        { from: 'src/tableau.png', to: 'tableau.png' },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new HtmlMinimizerPlugin(),
    ],
  },
  performance: {
    hints: false, // Отключить все предупреждения о производительности
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    compress: true,
  },
};