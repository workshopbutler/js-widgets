"use strict";

const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('./config.js');
const dest = path.resolve(__dirname, config.isDev?'public':'dist');

let webpackConfig = {
  watch: config.isDev,
  entry: config.entry,
  context: path.resolve(__dirname, 'src'),
  devServer: {
    contentBase: dest,
    watchContentBase: true,
    disableHostCheck: true,
  },
  output: {
    path: path.resolve(__dirname, config.src),
    filename: config.isDev ? `[name].js` : `[name].${getVersion()}.${config.options.lang}.js`,
    sourceMapFilename: config.isDev ? `[name].js.map` : `[name].${getVersion()}.js.map`
  },
  externals: {
    jquery: 'jQuery'
  },
  devtool: config.isDev ? 'inline-source-map' : false,
  plugins: getPlugins(),
  module: {
    rules: [
      {
        test: /locales/,
        loader: '@alienfast/i18next-loader',
        query: {
          include: [`**/${config.options.lang}.json`]
        },
      },
      {
        test: /\.(njk|nunjucks)$/,
        loader: 'nunjucks-loader',
        query: {
          root: path.resolve(__dirname, 'src/templates')
        }
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          // config.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')()
              ]
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              'limit': 10000,
              'name': '[name][hash:6].[ext]'
            }
          }
        ]
      },
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: [".js", ".ts", '.njk']
  },
  node: {
    fs: "empty"
  },
  optimization: {
    noEmitOnErrors: true,
    minimizer: getMinimizer()
  },
};

function getPlugins() {
  let plugins = [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      nunjucks: 'nunjucks'
    }),
    new webpack.DefinePlugin({
      BACKEND_URL: JSON.stringify(config.env.backend),
      API_VERSION: JSON.stringify(config.options.apiVersion),
      WIDGET_VERSION: JSON.stringify(getVersion()),
      WIDGET_LANGUAGE: JSON.stringify(config.options.lang),
    }),
    new MiniCssExtractPlugin({
      filename: config.isDev? `[name].css` : `[name].${getVersion()}.min.css`
    })
  ];

  if (config.isDev && config.options.apiKey === 'mock') {
    plugins.push(new webpack.NormalModuleReplacementPlugin(
      /\/common\/Transport\.ts/,
      '../../mock/MockTransport.ts'
    ));
    plugins.push(new webpack.NormalModuleReplacementPlugin(
      /\/utils\/Time\.ts/,
      '../../mock/MockTime.ts'
    ));
  }

  if (!config.isDev) {
    plugins.push(new MinifyPlugin())
  }

  return plugins;
}

function getMinimizer() {
  let minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    }),
  ];
  if (!config.wordpress) {
    minimizer.push(new OptimizeCSSAssetsPlugin({}));
  }
  return minimizer;
}

function getVersion() {
  if (process.env.TRAVIS_TAG) {
    return process.env.TRAVIS_TAG;
  } else {
    return process.env.npm_package_version;
  }
}

module.exports = webpackConfig;
