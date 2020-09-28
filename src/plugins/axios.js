"use strict";

import Vue from 'vue';
import axios from "axios";
import {Message}  from 'element-ui'
import router from  '../router.js'


let loading = null
let requestCount = 0  // 多次点击的处理
// 显示loading
function showLoading(){
	if(requestCount === 0){
		loading = Message({
		  message: '加载中...',
		  duration:0  // 展示时间 默认3000毫秒  0 不会自动关闭
		});
	}
	requestCount++
}
// 隐藏loading
function hideLoading(){
	if(requestCount > 0){
		requestCount--
	}
	if(loading && requestCount === 0){
		loading.close()
	}
}

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let config = {
   baseURL: "/api",
   timeout: 60 * 1000,
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use((config)=>{

	    if(window.sessionStorage.getItem('token'))
		   config.headers['token'] = window.sessionStorage.getItem('token')
		
		if(config.loading === true)
		   showLoading()
		   
		return config;
	
    },(error)=>{
		
	   hideLoading()
	   return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use((response)=>{

		let data = response.data
		
		if( data.code !== 200 ){
			
			Message.error(data.data)
			// 没有登录 或者 登录超时
			if( data.code === 300 ){
                  window.sessionStorage.clear()
                  router.push({name: "login"})
			}
			return Promise.reject(response) // reject将触发调用者的catch方法
		}

    	 hideLoading()  	// 隐藏loading

    	 return response.data   // return  response.data 后端返回的data是包装在一个对象的data字段中，此对象中也有一个state字段；

	},(error)=> {
		
		hideLoading()
		Message.error("后台接口系统异常,请联系管理员!")
		return Promise.reject(error)
	}
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {  return _axios; }
    },
    $axios: {
      get() {  return _axios; }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
