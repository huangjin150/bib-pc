const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      client: {
        overlay: false
      }
    },
    resolve: {
      fallback: {
        "net": false,
        "tls": false,
        "fs": false,
        "child_process": false
      }
    }
  },
})
