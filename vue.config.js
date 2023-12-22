// 配置跨域
export default {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 接口域名
        changeOrigin: true, // 是否跨域
        ws: true, // 是否代理 websockets
        secure: false, // 是否 https 接口
        pathRewrite: {
          // 路径重置，将接口路径的前缀 /api 重写为空字符串
          '^/api': ''
        }
      }
    }
  }
}
