const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  css: {
    sourceMap: false
  },
  chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('pages', resolve('src/pages'))
      .set('assets', resolve('src/assets'))

    config.plugin('compression-webpack-plugin')
      .use(CompressionWebpackPlugin, [{
        filename: '[path].gz[query]',
        test: /\.(js|css)?$/i,
        threshold: 10240,
        minRatio: 0.8
      }])

    config.externals({
      'element-ui': 'ELEMENT',
      'vue-router': 'VueRouter',
      'echarts': 'echarts',
      'vue': 'Vue',
      'axios': 'axios'
    })

    // 删除预加载
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
  },
  productionSourceMap: false,
  publicPath: '' // 配置为相对路径，解决打包上线后静态资源路径的问题
}
