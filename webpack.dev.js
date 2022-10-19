const path = require('path');
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')


module.exports = merge(common,{
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'images/[name][ext]'
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader","css-loader"]
            },
            {
                test: /\.scss$/,
                use: ["style-loader","css-loader", "sass-loader"]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'studio.html',
            template: "./client/views/studio.html",
            chunks:['vendor','studio'],
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: "./client/views/login.html",
            chunks:['login'],
        }),
        new HtmlWebpackPlugin({
            filename: 'storage.html',
            template: "!!raw-loader!" +"./client/views/storage.html",
            chunks:['storage'],
        }),
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: "!!raw-loader!" +"./client/views/home.html",
            chunks:['home'],
        }),
        new HtmlWebpackPlugin({
            filename: 'post.html',
            template: "!!raw-loader!" +"./client/views/post.html",
            chunks:['post'],
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery"
        })
    ]
})