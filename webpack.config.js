"use strict";

const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = (process.env.NODE_ENV !== "build" && process.env.NODE_ENV !== "build-wordpress");
const options = {
  backend: "https://api.workshopbutler.com/",
  apiKey: process.env.API_KEY,
  theme: 'alfred',
  apiVersion: '2021-09-26',
  lang: process.env.LANG ? process.env.LANG : 'en',
};

let webpackConfig = {
  watch: isDev,
  entry: {
    widgets: './app.ts',
  },
  context: path.resolve(__dirname, 'src'),
  devServer: {
    contentBase: path.resolve(__dirname, isDev?'public':'dist'),
    watchContentBase: true,
    disableHostCheck: true,
  },
  output: {
    path: path.resolve(__dirname, isDev ? 'site/static/' : `dist/`),
    filename: isDev ? `[name].js` : `[name].${getVersion()}.${options.lang}.js`,
    sourceMapFilename: isDev ? `[name].js.map` : `[name].${getVersion()}.js.map`
  },
  externals: {
    jquery: 'jQuery'
  },
  devtool: isDev ? 'inline-source-map' : false,
  plugins: getPlugins(),
  module: {
    rules: [
      {
        test: /locales/,
        loader: '@alienfast/i18next-loader',
        query: {
          include: [`**/${options.lang}.json`]
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
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              'limit': 10000,
              'name': '[name][hash:6].[ext]'
            }
          }
        ]
      }
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
      BACKEND_URL: JSON.stringify(options.backend),
      API_VERSION: JSON.stringify(options.apiVersion),
      WIDGET_VERSION: JSON.stringify(getVersion()),
      WIDGET_LANGUAGE: JSON.stringify(options.lang),
    }),
    new MiniCssExtractPlugin({
      filename: isDev? `[name].css` : `[name].${getVersion()}.min.css`
    })
  ];

  if (isDev && options.apiKey === 'mock') {
    plugins.push(new webpack.NormalModuleReplacementPlugin(
      /\/common\/Transport\.ts/,
      '../../mock/MockTransport.ts'
    ));
    plugins.push(new webpack.NormalModuleReplacementPlugin(
      /\/utils\/Time\.ts/,
      '../../mock/MockTime.ts'
    ));
  }

  return plugins;
}

function getMinimizer() {
  let minimizer = [
    new TerserPlugin({
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    }),
  ];
  if (process.env.NODE_ENV !== "build-wordpress") {
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
