const CompressionWebpackPlugin = require("compression-webpack-plugin");

const productionGzip = true
const productionGzipExtensions = ['js', 'css']

module.exports = {
  assetsDir: 'assets',
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: config => {
    const myConfig = {}
    if (process.env.NODE_ENV === 'production') {
      myConfig.plugins = []
      productionGzip && myConfig.plugins.push(
        new CompressionWebpackPlugin({
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 8192,
          minRatio: 0.8
        })
      )
    }
    return myConfig
  },
}
