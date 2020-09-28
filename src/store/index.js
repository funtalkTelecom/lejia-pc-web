import vue from 'vue'
import vuex from 'vuex'
import goods_create from './modules/goods_create.js'
import user from "./modules/user.js"
import menu from "./modules/menu.js"

vue.use(vuex)

export default new vuex.Store({
	modules:{
				 goods_create,		
				 user,
				 menu
			 }

})