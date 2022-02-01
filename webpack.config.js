const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "production",
    entry: './index.js',
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.png'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    devServer: {
        historyApiFallback: {
            rewrites: [
                {
                    from: /./, to: '/main.html'
                }
            ]
        },
        port: 4200
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                filename: "main.html",
                template: "pug/pages/index.pug",
                inject: true

            }
        ),
        new HtmlWebpackPlugin(
            {
                filename: "temp/page.html",
                template: "pug/pages/page.pug",
                inject: true
            }
        ),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
              test: /\.css/i,
              use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpg|scg)/i,
                loader: 'file-loader'
            },
            {
                test: /\.pug$/i,
                loader: "pug-loader"
            },
            {
                test:/\.ttf/i,
                loader: "file-loader"
            }
        ]
    }
}