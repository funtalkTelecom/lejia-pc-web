module.exports = {

  productionSourceMap: true, // 生产环境是否生成 sourceMap 文件
  chainWebpack:config =>{
      // 生产模式
	  config.when(process.env.NODE_ENV === 'production', config =>{
		  config.entry('app').clear().add('./src/main-prod.js')
		  
		  config.set('externals', {
		  	vue: 'Vue',
			axios: 'axios',
		  	'vue-router':'VueRouter',
			'element-ui': 'ELEMENT',
		  	echarts: 'echarts',

		  })
		  
		  config.plugin('html').tap(args => {
		            args[0].isProd = true
		            return args
		  })
	  })
	  // 开发模式
	  config.when(process.env.NODE_ENV === 'development', config =>{
	  		  config.entry('app').clear().add('./src/main-dev.js')
			  
			  config.plugin('html').tap(args => {
			          args[0].isProd = false
			          return args
			  })
	  })
  },
  lintOnSave: false,
  // 下面配置本地开发时生效,打包部署生产环境后无效
  devServer: {
    host: "localhost",
  	port: 8080, // 端口号
  	https: false, // https:{type:Boolean}
  	open: true, //配置自动启动浏览器
  	proxy: {
  		'/': { //代理api
  			target: 'http://localhost:9081/',//服务器api地址
  			ws: true,// proxy websockets
  			changeOrigin: true,//是否跨域
  			pathRewrite: { //重写路径
  				'^/': ''
  			}
  		}
  	}
  }
}