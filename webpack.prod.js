const path = require('path');
const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');
const webpack = require('webpack')
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const terserPlugin = require('terser-webpack-plugin')

module.exports = merge(common,{
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'images/[name][ext]',
        clean: true,
    },
    mode: "production",
    plugins: [
        new miniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [miniCssExtractPlugin.loader,"css-loader"]
            },
            {
                test: /\.scss$/,
                use: [miniCssExtractPlugin.loader,"css-loader", "sass-loader"]
            },
        ]
    },
    optimization: {
        minimizer: [
          new CssMinimizerPlugin(),
          new terserPlugin(),
          new HtmlWebpackPlugin({
            filename: 'studio.html',
            template: "./client/views/studio.html",
            chunks:['vendor','studio'],
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            }
          }),
          new HtmlWebpackPlugin({
            filename: 'login.html',
            template: "./client/views/login.html",
            chunks:['login'],
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            }
          }),
          new HtmlWebpackPlugin({
            filename: 'storage.html',
            template: "./client/views/storage.html",
            chunks:['storage'],
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            }
          }),
          new HtmlWebpackPlugin({
            filename: 'home.html',
            template: "!!raw-loader!" +"./client/views/home.html",
            chunks:['home'],
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                removeComments: true
            }
          }),
          new HtmlWebpackPlugin({
            filename: 'post.html',
            template: "!!raw-loader!" +"./client/views/post.html",
            chunks:['post'],
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                removeComments: true
            }
          })
        ],
      },
})