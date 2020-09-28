export default {
	state:{
		menuRules: {
			active: '0',
			list: []
		},
		operationRules:[]
	},
	getters:{
		// 首页
		adminIndex(state){
			if(state.menuRules.list.length === 0){
				return 'error_404'
			}
			let item = state.menuRules.list[0].children[0]
			if(item){
				return item.url
			}
		}
	},
	mutations:{
		// 创建菜单
		savePermission(state,data){
			
			let menuList = data.menuRules[0].children.map(item=>{
				return {
					name: item.name,
					subActive: '0',
					children:item.children
				}
			})
            state.menuRules.active='0'			
			state.menuRules.list = menuList
			state.operationRules= data.operationRules
			window.sessionStorage.setItem('menuRules',JSON.stringify(state.menuRules))
			window.sessionStorage.setItem('operationRules',data.operationRules)
		},
		// 初始化菜单   用来解决用户登录后，刷新操作 导致state缺失,重新往state中填充数据
		initPermission(state){
			
			let menuRules = window.sessionStorage.getItem('menuRules')
			let operationRules = window.sessionStorage.getItem('operationRules')
			
			menuRules = menuRules ? JSON.parse(menuRules) : {
				active: '0',
				list: []
			}
			
			operationRules = operationRules ? operationRules :[]
					
			state.menuRules = menuRules
			state.operationRules = operationRules
		}
	},
	
	actions:{
		
	}
}