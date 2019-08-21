/*
 * @Author: He zhenliang
 * @Date: 2019-08-21 09:31:55
 * @LastEditors: Do not Edit
 * @LastEditTime: 2019-08-21 11:48:55
 */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');
var webpack             = require('webpack');



// 环境变量配置，dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';

// 获取html-webpack-plugin参数的方法 
var getHtmlConfig = function(name){
  return {
      template    : './src/view/' + name + '.html',
      filename    : 'view/' + name + '.html',
      inject      : true,
      hash        : true,
      chunks      : ['common', name]
  };
};


var config = {
  mode : 'dev' === WEBPACK_ENV ? 'development' : 'production',
  entry: {
    'index'             : './src/page/index/index.js',
    'user-login'             : './src/page/user-login/index.js',
    'common'            : './src/page/common/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath  :  '../', //'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymmall.com/mmall-fe/dist/',
    filename    : 'js/[name].js'
  },
  externals : {
    'jquery' : 'window.jQuery'
  },
  module: {
    /* 
    * 【改动】：loader的使用中，loaders字段变为rules，用来放各种文件的加载器，用rules确实更为贴切
    */
    rules: [
        /* 
        * 【改动】：css样式的加载方式变化
        */
        // css文件的处理
        {
          test: /\.css$/,
          loader:[MiniCssExtractPlugin.loader,'css-loader'],
        },
                  // 模板文件的处理
                  {
                    test: /\.string$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            minimize : true,
                            removeAttributeQuotes : false
                        }
                    }
                },
                /* 
                * 【改动】：图片文件的加载方式变化，并和字体文件分开处理
                */
                // 图片的配置
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                /* 
                                * 【改动】：图片小于2kb的按base64打包
                                */
                                limit: 2048,
                                name: 'resource/[name].[ext]'
                            }
                        }
                    ]
                },
                /* 
                * 【改动】：字体文件的加载方式变化
                */
                // 字体图标的配置
                {
                    test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: 'resource/[name].[ext]'
                            }
                        }
                    ]
                }
      ]
    },
    plugins:[
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
        chunkFilename: "[id].css"
      }),
      new HtmlWebpackPlugin(getHtmlConfig('user-login')),
      new HtmlWebpackPlugin(getHtmlConfig('index')),

    ],

    devServer: {
      port: 8088,
      inline: true,
      proxy : {
          '**/*.do' : {
              target: 'http://test.happymmall.com',
              changeOrigin : true
          }
      }
  }
};


module.exports = config;

