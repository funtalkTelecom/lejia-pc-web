import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
// import './plugins/element.js'
import element from 'element-ui'
import router from  './router.js'
import store from './store'  // 如果是引入index.js可以不用写文件名
import VueDND from 'awe-dnd' // 引入拖拽组件

Vue.use(element)
Vue.use(VueDND)

// 引入全局配置文件
import $conf from "./common/config/config.js"

Vue.prototype.$conf = $conf

Vue.config.productionTip = false

new Vue({
	router,
	store,
    render: h => h(App),
}).$mount('#app')
