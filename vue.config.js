'use strict'

const path = require('path')
const { merge } = require('webpack-merge')
const tsImportPluginFactory = require('ts-import-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const port = process.env.port || process.env.npm_config_port || 9528 // dev port
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  // https://github.com/youzan/vant/issues/5735
  parallel: process.env.NODE_ENV === 'development',
  devServer: {
    port: port,
    proxy: {
      '/dev': {
        target: 'http://192.168.0.0:8388',
        changeOrigin: true,
        pathRewrite: {
          '^/dev': ''
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    name: 'vue3-vant-template',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },

  chainWebpack(config) {
    // set ts-loader
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        })
        return options
      })

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'),
          minChunks: 3,
          priority: 5,
          reuseExistingChunk: true
        },
        node_vendors: {
          name: 'chunk-libs',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: 10
        },
        vantUI: {
          name: 'chunk-vantUI',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?vant(.*)/
        }
      }
    })
    config.optimization.runtimeChunk('single')
  }
}
