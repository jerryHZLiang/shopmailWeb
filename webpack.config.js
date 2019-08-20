/*
 * @Author: He Zhen liang
 * @Date: 2019-08-19 11:49:32
 * @LastEditTime: 2019-08-20 09:30:37
 */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')


var getHtmlConfig = function(name){
  return {
      template: './src/view/'+ name + '.html', // 源模板文件
      filename: 'view/'+ name + '.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
      hash: true,
      inject: true,
      chunks: ["common",'index']
  }
}


//webpack config
var config = {
  entry: {
    'index': ['./src/page/index/index.js'],
    'login': ['./src/page/login/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath:'/dist',
    filename: './js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              publicPath: './'
            },
          },
          'css-loader', 
        ],
      },
      {
        test: /\.(gif|png|jpg|svg|ttf)\??.*$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              publicPath: './'
            },
          },
          'url-loader?limit=100&name=resource/[name].[ext]', 
        ],
      }
    ]
  },
  mode: 'production',
  externals :{
    'jquery' : 'window.jQuery'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // 类似 webpackOptions.output里面的配置 可以忽略
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new HtmlWebpackPlugin(getHtmlConfig('index')),
    new HtmlWebpackPlugin(getHtmlConfig('login')),
    
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
          commons: { // 其他同步加载公共包
            chunks: 'all',
            minChunks: 2,
            name: 'base',
            priority: 80,
          },
      }
  }
  }
};
module.exports = config