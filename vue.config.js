const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const path = require('path');
module.exports = {
  lintOnSave: false,

  devServer: {
      proxy: {
          '/Logic': {
              target: 'http://qs-ma.on-bright.com',
              changeOrigin: true,
              ws: true,
          }
      }
  },

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/assets/variable.less')
      ]
    }
  }
}
