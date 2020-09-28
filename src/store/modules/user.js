export default {
	state:{
		user:{},
		token:false
	},
	getters:{
		
	},
	mutations:{
		// 初始化用户信息  用来解决用户登录后，刷新操作导致state缺失,重新往state中填充数据
		initUser(state){
			console.log("initUser")
			let user = window.sessionStorage.getItem('user')
			if(user){
				state.user = JSON.parse(user)
			}
		},
		// 登录
		login(state,data){
			// 保存登录状态
			state.user =  data.user
			state.token = data.token
			// 存储到本地存储
			window.sessionStorage.setItem('user',JSON.stringify(data.user))
			window.sessionStorage.setItem('token',data.token)  // token本身就是字符串了，不能再JSON.stringify()
		},
		// 退出登录
		logout(state){
			// 清除状态
			state.user = {}
			state.token = false
			// 清除本地存储
			window.sessionStorage.clear()

		}
	},
	actions:{
		
	}
}