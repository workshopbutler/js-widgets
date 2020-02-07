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
const dest = path.resolve(__dirname, 'dist');

let webpackConfig = {
  watch: config.isDev,
  entry: config.entry,
  context: path.resolve(__dirname, 'src'),
  devServer: {
    contentBase: dest,
    watchContentBase: true
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
        // options here
        //query: { overrides: [ '../node_modules/lib/locales' ] }
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
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')()
              ]
            }
          },
          'less-loader'
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
    new CleanWebpackPlugin([
      path.resolve(__dirname, 'dist'),
    ]),
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
  const hugoSrc = path.resolve(__dirname, 'site');
  const hugoCmd = `hugo --buildDrafts --watch --source ${hugoSrc} --destination ${dest} --environment development`;

  if (config.isDev) {
    plugins.push(new WebpackShellPlugin({
        onBuildEnd: hugoCmd
      })
    );
    // plugins.push(new BundleAnalyzerPlugin());
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
