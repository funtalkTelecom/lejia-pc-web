<template>
	<div>
		<el-card>
			<el-row :gutter="20" >			
				<el-col :span="7">
					  <el-input placeholder="请输入用户姓名" v-model="param.name"  size="mini" clearable  @clear="loadUserList()">
						<el-button slot="append" icon="el-icon-search" @click="loadUserList()"></el-button>
					  </el-input>
				  </el-col>
				<el-col :span="4">
					<el-button type="primary" size="mini" @click="userAction(false)">添加用户</el-button>
				</el-col>
			</el-row>
			
			<!-- 表格 -->
			<el-table  :data="userList" style="width: 100%" border stripe>
			  <el-table-column type="index"></el-table-column>
			  <el-table-column	prop="login_name"	label="工号"	width="180"> </el-table-column>
			  <el-table-column	prop="name"	label="姓名"	width="180"> </el-table-column>
			  <el-table-column	prop="phone" label="电话"></el-table-column>
			  <el-table-column	prop="email" label="邮箱"></el-table-column>
			  <!-- <el-table-column	prop="roles" label="角色"></el-table-column> -->
			  <el-table-column label="状态">
				  <template slot-scope="scope">
					  <el-switch v-model="scope.row.status" 
					      active-value="1"  inactive-value="0"
						  @change="changeStatus(scope.row)">
					  </el-switch>
				  </template>
			  </el-table-column>
			  <el-table-column	label="操作">
				  <template v-slot="scope">
					  <el-button type="primary" size="mini" icon="el-icon-edit" @click="userAction(scope.row)"></el-button>
					  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
					  
					  <el-tooltip class="item" effect="light" content="分配角色" placement="top-start">
					      <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
					  </el-tooltip>
					  
				  </template>
			  </el-table-column>
			  
			</el-table>
			
			<!-- 分页 -->
			<el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange"
			  :current-page="param.start" :page-sizes="[10,20,50,100]" :page-size="param.limit" :total="total"
			  layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>

		</el-card>
		
		<!-- 用户对话框  添加/修改用户共用  修改时不允许修改工号 -->
         <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="40%" @close="$refs['userFormRef'].resetFields()">
           <el-form :model="userForm" :rules="userFormRules"  ref="userFormRef" label-width="100px">
			  <el-form-item label="登录工号" prop="loginName">
					<el-input v-model="userForm.loginName"  size="mini" @blur="checkIfExist()" :disabled="loginNameDisabled"></el-input>
			 </el-form-item>
			 <!-- 修改用户时，是否修改密码可选 -->
			 <el-form-item label="修改密码" v-if="loginNameDisabled">
                      <el-switch v-model="pwEditFlag" @change="pwEditChange($event)"></el-switch>
			 </el-form-item>
			 <el-form-item label="工号密码" prop="password">
				<el-input type="password"  v-model="userForm.password"  size="mini"  :disabled="!pwEditFlag"></el-input>
             </el-form-item>
			 <el-form-item label="姓名" prop="name">
			 				<el-input  v-model="userForm.name" size="mini"></el-input>
			 </el-form-item>
			 <el-form-item label="电话" prop="phone">
			 				<el-input  v-model="userForm.phone"  size="mini"></el-input>
			 </el-form-item>
			 <el-form-item label="邮箱" prop="email">
			 				<el-input  v-model="userForm.email"  size="mini"></el-input>
			 </el-form-item>
			 
           </el-form>
           <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="userSave()">确 定</el-button>
           </span>
         </el-dialog>

	</div>
</template>

<script>
	import md5 from 'js-md5'
	export default{
		data(){
			
			  //自定义验证方法
			  // var checkLoginName = (rule, value, callback) => {		  
				 //  this.axios.get(`/user/checkLoginName?loginName=${this.userForm.loginName}`).then(res=>{
					// 	 this.$message({showClose: true,message:res.data,type: 'success'})
					// 	 this.loginNamePassFlag=true
					// 	 callback()
				 //  })
			  // };
			
			return{
				userList:[],
				param:{
					name:'',
					start:0,
					limit:10
				},
				dialogName:'',
				dialogVisible:false,
				loginNamePassFlag:false,
				loginNameDisabled:false,
				pwEditFlag:true,
				pwTemporary:'',
				userForm:{ id:'',
					      loginName:'',
				          password:'',
						  name:'',
						  phone:'',
						  email:''},
				userFormRules:{
					loginName:[ { required: true, message: '请输入登录工号', trigger: 'blur' },
                                { min:5, max: 20, message: '登录工号长度为5-20位', trigger: 'blur' },
								// { validator: checkLoginName, trigger: 'blur' }
								],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ type: 'string', message: '请输入不包含空格的字符', trigger: 'blur',
						  transform(value) {
						    if (value && value.indexOf(' ') === -1) return value
						    else  return false
						  }
						},
						{ trigger: 'blur',
						  validator: (rule, value, callback) => {
						    let passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
						    if (!passwordreg.test(value)) 
						      callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
							  
							  callback()
						  },
					    }	
					  ],
					  name:[{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
					  phone:[{ required: true, message: '请输入手机号码', trigger: 'blur' },
							  { trigger: 'blur',
								validator: (rule, value, callback) => {
									if (!/^1[3456789]\d{9}$/.test(value)) 
										  callback(new Error("请输入正确的手机号"));
									  
									  callback()
							   }
							  }
					  ],
					  email:[{ required: true, message: '请输入邮箱', trigger: 'blur' },
							  { trigger: 'blur',
								validator: (rule, value, callback) => {
									let mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
									if (!mailReg.test(value)) 
										  callback(new Error("请输入正常的邮箱格式(xxx@xxx.xxx)"));
									  
									  callback()
							     },
							   }
							 ]
				    },
				total:0,
				status:false
			}
		},
		created() {
			this.loadUserList()
		},
		methods:{
			
			loadUserList() {
					this.axios.post('/user/list',this.param).then(res=>{
							this.userList=res.data.list
							this.total =res.data.total
					})
			},
		
			// 监听pagesize改变的事件
			handleSizeChange(newSize){
				
				this.param.limit=newSize
				this.loadUserList()
			},
			
			// 监听页码值改变的事件
			handleCurrentChange(newPage){
				
				this.param.start=newPage-1
				this.loadUserList()
				
			},
			
			changeStatus(row){
				this.axios.put(`/user/${row.id}/status/${row.status}`).then(
							this.$message('修改用户状态成功!')
					)	
			},
			
			userAction(row){
			
				if(row){
					this.dialogName='修改用户'
					this.loginNameDisabled = true
					this.pwEditFlag =false
					this.userForm.id=row.id
					this.userForm.loginName = row.login_name
					this.userForm.password = row.password
					this.pwTemporary=row.password
					this.userForm.name = row.name
					this.userForm.phone = row.phone
					this.userForm.email = row.email
                 
				 }else{
					 this.dialogName='添加用户'
					 this.loginNamePassFlag = false
					 this.loginNameDisabled = false
					 this.pwEditFlag =true
					 this.pwTemporary=''
					 this.userForm={  id:'',
						              loginName:'',
									  password:'',
									  name:'',
									  phone:'',
									  email:'' ,
								    }
				 }
				 
				 this.dialogVisible =true
			},
			
			userSave(){
								
				let checkRes=true
				
				if(this.loginNameDisabled && !this.pwEditFlag){

				  this.$refs.userFormRef.validateField(['name','phone','email'],
				                  (errormessage)=> {if(errormessage) checkRes=false })
				 }else{
					           this.$refs.userFormRef.validate(
							       validateRes => checkRes=validateRes)
				 } 
				
				 if(!checkRes){
				          this.$message('字段校验不通过,请核查!')
						  return
				 }
					   
				 if(this.loginNameDisabled){
					 
					 if(this.pwEditFlag)
					 	 this.userForm.password = md5(this.userForm.password)
					 else 
					 	 this.userForm.password=null
					 						  
				  }else{
					  
					  if(!this.loginNamePassFlag)
					  		this.$message('工号字段校验不通过,请核查!')
					   else
					  		this.userForm.password = md5(this.userForm.password)
				  }
				  
				 this.axios.post('/user/addOrEdit',this.userForm).then(
				   res =>{
						   this.$message('操作成功!')
						   this.dialogVisible =false
						   this.loadUserList()
				   }
				 )
			},
			
			checkIfExist(){
				
				   if(this.userForm.loginName.trim()=='') return 
				   
				   this.axios.get(`/user/checkLoginName?loginName=${this.userForm.loginName}`).then(res=>{
						 this.$message({showClose: true,message:res.data,type: 'success'})
						 this.loginNamePassFlag=true
				   }).catch( this.loginNamePassFlag=false )
			},
			
			pwEditChange($event){
								
				if($event){
					this.userForm.password=''
				}else{
					this.$refs['userFormRef'].clearValidate(['password'])
					this.userForm.password=this.pwTemporary
				}
				   
			},
			
			deleteUser(id){
				
				  this.$confirm('删除用户, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							
						  this.axios.delete(`/user/delete/${id}`).then(()=>{
								this.$message({ type: 'success', message: '删除成功!'})
								this.loadUserList()	  
									  
						   }
						  )	
				        })
			}
			
		}
		
	}
	
</script>

<style>
	
.el-table {
	       margin-top: 20px; 
           margin-bottom: 30px;
 }

</style>
