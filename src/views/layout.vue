<template>
	<div>
	<el-container style="position: absolute;left: 0;top: 0;bottom: 0;right: 0; overflow: hidden;">
	  <el-header class="d-flex align-items-center" style="background-color:#545c64;">
		  			  <a class="h5 text-white mb-0 mr-auto"> {{$conf.logo}} </a>
		  <el-menu :default-active="menuRules.active" mode="horizontal" @select="topMenuSelect" style="margin-left:50px;"
		    background-color="#545c64"  text-color="#fff"   active-text-color="#ffd04b">
		      <el-menu-item :index="index|numToString" v-for="(item,index) in menuRules.list" :key="index">
			   {{item.name}}
			  </el-menu-item>
		      			  
			  <el-submenu index="5-1">
		        <template slot="title">
					<el-avatar size="medium" :src="user.avatar? user.avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
				 {{user.loginName}}
				</template>
				
		        <el-menu-item index="5-1-1">修改</el-menu-item>
		        <el-menu-item index="5-1-2">退出</el-menu-item>
		      </el-submenu>
		  </el-menu>
	  </el-header>
	  <el-container  style="height: 100%; padding-bottom: 60px;">
		  <!-- 侧边栏 导航 -->
	    <el-aside width="200px" class="bg-white">	
			<el-menu  :default-active="sideMenuActive" @select="sideMenuSelect">
			      <el-menu-item :index="index|numToString" v-for="(item,index) in slideMenus" :key="index">
						<i :class="item.icon"></i>
						<span slot="title">{{item.name}}</span>		
                    </el-menu-item>
           </el-menu>
			
		</el-aside>
        <el-main class="bg-light" style="position: relative;">
			
			<!-- 面包屑导航 -->
			<div class="border-bottom mb-3 bg-white"  v-if="bran.length > 0" style="padding: 20px;margin: -20px;">
				<el-breadcrumb separator-class="el-icon-arrow-right">
				  <el-breadcrumb-item v-for="(item,index) in bran"  :key="index" :to="{ path: item.path }">
					  {{item.title}}
				  </el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			
			<!-- 主内容 -->
			<router-view></router-view>
			
			<el-backtop target=".el-main" :bottom="100">
				<div style="height: 100%; width: 100%; background-color: #f2f5f6; box-shadow: 0 0 6px rgba(0,0,0, .12); 
				      text-align: center;  line-height: 40px; color: #1989fa;">
					UP
				</div>
			</el-backtop>
			
          </el-main>
        </el-container>
	</el-container>
	
	</div>
</template>

<script>
	import common from "@/common/mixins/common.js"
    import {mapState} from 'vuex'
    export default {
		mixins:[common],
		provide(){
			return { layout:this }
		 },
		data() {
		  return {
			bran:[]
			}
		},
		
		// 初始化菜单
		created(){
			
			this.getCrumbs()  // 获取面包屑导航
			this.initMenu()   // 初始化选中菜单
					
		},
		
		watch: {
			
			'$route'(to, from) {
				console.log("watch route...")
				console.log(to)
				
				 this.menuRules.list.forEach((x,i1) =>{		          
									x.children.forEach( 
											(y,i2)=> {							
													if(y.url === to.name){
														this.menuRules.active = i1.toString()
														this.sideMenuActive  = i2.toString()					
												  }
											}
									)
				 })
				
				this.getCrumbs()
			}
		},
		
		computed: {

			...mapState({
				user:state =>state.user.user,
				token:state =>state.user.token,
				menuRules:state =>state.menu.menuRules
			}),
			
			sideMenuActive:{
				get(){
					let item = this.menuRules.list[this.menuRules.active]
					return item ? item.subActive:'0'
				},
				set(val){
					console.log(this.menuRules.active)
					let item = this.menuRules.list[this.menuRules.active]
					if(item){
						item.subActive = val
					}
					console.log(item.subActive)
				}
			},

			slideMenus() {
				let item = this.menuRules.list[this.menuRules.active]
				return item ? item.children : []
			}
		},

		methods: {
				  initMenu(){
						this.$router.push({
							name:this.slideMenus[this.sideMenuActive].url
						 })
				  },
					  
				  topMenuSelect(key, keyPath) {
					  
					if (key === '5-1-1') {
						return console.log('修改资料')
					}
					if (key === '5-1-2') {		
						return this.logout() // 退出登录
					}

					this.menuRules.active=key
					
					if(this.slideMenus.length>0) {
						this.$router.push({
							name:this.slideMenus[this.sideMenuActive].url
						})
					}
				  },
				  
				  sideMenuSelect(key, keyPath) { 
					 this.sideMenuActive = key
					 this.$router.push({
						   name:this.slideMenus[key].url
					  })
				  },
				  // 获取面包屑导航
				  getCrumbs(){
					  
					console.log(this.$route.matched)			  
					let b = this.$route.matched.filter(v=>v.name)
					let arr = []
					b.forEach((v,k)=>{
						if (v.name === 'index' || v.name === 'layout') return  // 过滤layout和index
						arr.push({
							name:v.name,
							path:v.path,
							title:v.meta.title
						})
					})
					if (arr.length > 0) {
						arr.unshift({ name:'index',path:'/index',title:'后台首页' }) //数组的头部添加元素
				    }
					this.bran = arr
				  },
			  
				  // 退出登录
				  logout(){
					  this.axios.post('/user/logout',{},{ loading:true }).then(res=>{
						  
						  this.$message('退出成功')
						  this.$store.commit('logout')  // 清除状态和存储
						  this.$router.push({name:"login"})  // 返回到登录页
						  
					  }).catch(err=>{
						  
						  this.$store.commit('logout')   // 清除状态和存储
						  this.$router.push({name:"login"})  // 返回到登录页
						  
					  })
				  }
				  
		}
  }
	
</script>

<style>
	

</style>
