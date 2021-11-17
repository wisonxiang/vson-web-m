module.exports = {
  lintOnSave: false, // 取消 eslint 验证
  assetsDir: "mstatic",
  publicPath: process.env.NODE_ENV === "production" ? "//cdn.vson.top" : "/",
  productionSourceMap: false,
  devServer: {
    port: 8080,
    proxy: {
      "/socket.io": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        ws: true, // 这一行很关键  表示是否开启  websocket
      },
    },
  },

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
            unitToConvert: "px",
            viewportWidth: 750,
            unitPrecision: 3,
            propList: ["*", "!font-size"],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: /(\/|\\)(node_modules)(\/|\\)/,
          }),
        ],
      },
    },
  },
};
