<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-12 col-sm-9 col-md-7 col-lg-5 m-auto pt-5">
					<div class="card mt-5">
						<div class="card-header bg-white">
							<h3 class="text-center mb-0 text-secondary">
   							  {{$conf.logo}}
							</h3>
						</div>
						<div class="card-body">
							<el-form ref="ruleForm" :rules="rules"  :model="form">
								<el-form-item prop="loginName">
									<el-input v-model="form.loginName"	size="medium"  placeholder="请输入用户名">
									</el-input>
								</el-form-item>
								<el-form-item prop="password">
									<el-input v-model="form.password"  size="medium" type="password"	placeholder="请输入密码">
									</el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" size="medium" class="w-100" @click="submit" :loading="loading">
										{{loading? '登录中...' : '立即登录'}}
									</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		
	</div>
</template>

<script>
	let ms = []
	import { mapGetters } from 'vuex'
	import {Message}  from 'element-ui'
	export default {
		data() {
			return {
				loading:false,
				form:{
					loginName:"",
					password:""
				},
				rules:{
					loginName:[
						{ required:true,message:"请输入用户名",trigger:'blur' }
					],
					password:[
						{ required:true,message:"请输入密码",trigger:'blur' }
					]
				}
			}
		},
		computed: {
			...mapGetters([
				'adminIndex'
			])
		},
		methods: {
			submit() {
				
				// $refs内置方法获取所有如此设置的ref   ref="ruleForm"
				this.$refs.ruleForm.validate((e)=>{
						if (!e) return;
						this.loading = true  
						this.axios.post('/user/login',this.form).then(res=>{
                      
					    if(res.data.menuRules.length == 0){
						  Message("用户没有配置菜单权限,请联系管理员配置!")
						  this.loading = false
						  return
					    } 

						this.$store.commit('login',res.data)  // 存储到本地存储
						// 存储权限规则
						// if(data.role && data.role.rules){
						// 	window.sessionStorage.setItem('rules',JSON.stringify(data.role.rules))
						// }

						this.$store.commit('savePermission',res.data) // 生成后台菜单
                        this.$router.push({name:this.adminIndex})
						this.loading = false				

					}).catch(err=>{
						
						this.loading = false
					})
				})
			}
		},
	}
</script>

<style>
</style>