import Vue from 'vue'
import App from './App.vue'
import router from  './router.js'

import './plugins/axios'
import './plugins/element.js'
import store from './store'  // 如果是引入index.js可以不用写文件名
import VueDND from 'awe-dnd' // 引入拖拽组件
import $conf from "./common/config/config.js"  // 引入全局配置文件

Vue.use(VueDND)

Vue.prototype.$conf = $conf
Vue.config.productionTip = false

new Vue({
	router,
	store,
    render: h => h(App),
}).$mount('#app')
