import Vue from "vue"
import Router from "vue-router"
import routes from "./common/config/router.js"

Vue.use(Router)

/* 用element ui写得侧边导航栏中用到了路由，然后重复点击这个路由就出现这个报错
  Avoided redundant navigation to current location */
const originalPush = Router.prototype.push
   Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

let router =new Router({ 
    mode: process.env.NODE_ENV ==='development'? '':'history',   //取消网址后面的#
	routes })

// 定义全局前置路由守卫
router.beforeEach((to, from, next) => {

  	// 获取token
  	let token = window.sessionStorage.getItem('token')

	  if(token){ // 已登录
	  
	     if(to.name==='login')
			window.sessionStorage.clear()
	
		  return next()
	  
	    }else{ // 未登录
		
			// 跳过登录页验证 解决无限循环问题
			if(to.path === '/login')
			   return next();
		  
		    next({path:'/login'})
	  }
})

export default  router