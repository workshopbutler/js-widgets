"use strict";

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const config  = require('./config.js');

let webpackConfig = {
    watch: config.isDev,
    entry: config.entry,
    context: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, config.src),
        filename: `[name].${process.env.npm_package_version}.js`,
        publicPath: "/",
    },
    externals: {
        jquery: 'jQuery'
    },
    devtool: config.isDev? 'inline-source-map': false,
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            nunjucks: 'nunjucks'
        }),
        new webpack.DefinePlugin({
            BACKEND_URL: JSON.stringify(config.env.backend)
        }),
        new ExtractTextPlugin({
            filename: "[name].min.css"
        }),
        new HtmlWebpackPlugin({
            template: 'pages/event-list.html',
            filename: 'event-list.html',
            inject: 'head',
            config: config.options
        }),
        new HtmlWebpackPlugin({
            template: 'pages/event-page.html',
            filename: 'event-page.html',
            inject: 'head',
            config: config.options
        }),
        new HtmlWebpackPlugin({
            template: 'pages/registration.html',
            filename: 'registration.html',
            inject: 'head',
            config: config.options
        }),
        new HtmlWebpackPlugin({
            template: 'pages/trainer-list.html',
            filename: 'trainer-list.html',
            inject: 'head',
            config: config.options
        }),
        new HtmlWebpackPlugin({
            template: 'pages/trainer-page.html',
            filename: 'trainer-page.html',
            inject: 'head',
            config: config.options
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader',
                query: {
                    root: path.resolve(__dirname, 'src/templates')
                }
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            'presets': [['babel-preset-env', {
                                "targets.uglify": true
                            }]]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
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
                })
            },
            {
                test: /\.png$/,
                use:  [
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
        extensions: [".js", ".ts"]
    },
    node: {
        fs: "empty"
    }
};

if (!config.isDev){
    webpackConfig.plugins.push(
        new MinifyPlugin()
    );
}

if (config.isDev){
    webpackConfig.devServer = {
        host: 'localhost',
        port: 8081,
        inline: true,
        contentBase: path.join(__dirname, config.src),
    }
}


module.exports = webpackConfig;
