const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .end();

    config.resolve
      .extensions
      .merge(['.ts', '.js']);
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    },
  }
})
