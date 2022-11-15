const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.ts'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public')
    },

    devtool: 'inline-source-map',
    devServer:{
        static: path.resolve(__dirname, 'src'),
        port:9000
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets:false
        }),
        new CopyPlugin({
            patterns:[
                {
                    from:"index.html",
                    context:"src/"
                },
                {
                    from:"assets/**/*",
                    context:"src/"
                }
            ]
        })
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [ 
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_moudles/
            }
        ]
    }
}