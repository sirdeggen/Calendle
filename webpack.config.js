const webpack = require('webpack');

module.exports = {
    // ...existing configuration...
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    // ...existing configuration...
}
