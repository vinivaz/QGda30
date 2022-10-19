
module.exports = {
    devtool: false,
    entry: {
        vendor: "./client/js/studio/vendor.js",
        studio: "./client/js/studio/index-test.js",
        login: "./client/js/login/index.js",
        storage: "./client/js/storage/index.js",
        home: './client/js/home/index.js',
        post: './client/js/post/index.js'
    },
    module: {
        rules: [
            
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(svg|png|jpg|jpng|gif)$/,
                type: "asset/resource"
            }
        ]
    }
}