module.exports = {
    lintOnSave: false, // 取消 eslint 验证
    assetsDir: 'mstatic',
    publicPath: process.env.NODE_ENV === 'production' ? '//cdn.vson.top' : '/',
    productionSourceMap: false,
    
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
                    })
                ]
            }
        }
    }
}