<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="preUrl" @tab-click="getList">
		    <el-tab-pane label="管理员列表" name="manager">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini" @click="openDialog('manager')">添加管理员</el-button>
					<div class="ml-auto d-flex">
						<el-input size="mini" placeholder="请输入用户名" v-model="keyword" style="width:200px;"></el-input>
						<el-button type="info" size="mini" class="ml-2" @click="getList">搜索</el-button>
					</div>
				</div>
				<el-table border class="mt-3"  :data="managerList"  style="width: 100%">
				  <el-table-column	align="center"	label="用户头像">
					<template slot-scope="scope">
						<el-avatar size="large" :src="scope.row.avatar"></el-avatar>
					</template>
				  </el-table-column>
				  <el-table-column	align="center"	label="用户名"	prop="username"></el-table-column>
				  <el-table-column	align="center"	label="所属管理员">
					<template slot-scope="scope">
						{{scope.row.role.name}}
					</template>
				  </el-table-column>
				  <el-table-column	prop="status"	align="center"	label="状态">
					<template slot-scope="scope">
						<el-button	:type="scope.row.status ? 'success' : 'danger'" 
						            size="mini"	@click="changeStatus(scope.row)"	plain>
						    {{scope.row.status ? '启用' : '禁用'}}
						</el-button>
					</template>
				  </el-table-column>
				  <el-table-column	align="center"	label="操作"	width="150">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="openDialog('manager',scope.row)">修改</el-button>
						<el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
					</template>
				  </el-table-column>
				</el-table>
			</el-tab-pane>
		    <el-tab-pane label="角色列表" name="role">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini"
					v-auth="'添加角色'" @click="openDialog('role')">添加角色</el-button>
				</div>
				<el-table border class="mt-3"  :data="roleList"  style="width: 100%">
				  <el-table-column	align="center"	label="角色名称"	prop="name"></el-table-column>
				  <el-table-column	align="center"	label="角色描述"	prop="desc"></el-table-column>
				  <el-table-column	prop="status"	align="center"	label="状态">
					<template slot-scope="scope">
						<el-button	:type="scope.row.status ? 'success' : 'danger'" 
						            size="mini"	@click="changeStatus(scope.row)" plain>
						{{scope.row.status ? '启用' : '禁用'}}
						</el-button>
					</template>
				  </el-table-column>
				  <el-table-column
					align="center"
					label="操作"
					width="250">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="openDialog('role',scope.row)">修改</el-button>
						<el-button type="text" size="mini" @click="openDrawer(scope.row)">配置权限</el-button>
						<el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
					</template>
				  </el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权限列表" name="rule">
				
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini"
					v-auth="'添加规则'" @click="openDialog('rule')">添加规则</el-button>
				</div>
				
				<el-tree :data="ruleList" :props="defaultProps" @node-click="handleNodeClick"
				default-expand-all :expand-on-click-node="false">
					
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<div>
							<span v-if="data.menu" :class="data.icon ? data.icon : 'el-icon-star-off'" class="mr-2 text-muted"></span>
							<small v-else class="mr-2 text-muted">{{data.method}}</small>
							<span>{{ data.name }}</span>
							<span v-if="data.menu" class="badge ml-2">{{data.frontpath}}</span>
							<span v-else class="badge badge-secondary ml-2">{{data.condition}}</span>
						</div>
						<span>
						  <el-button
						  :type="data.status ? 'success' : 'danger'" 
						  size="mini"
						  @click="changeStatus(data)"
						  plain>{{data.status ? '启用' : '禁用'}}
						  </el-button>
						  <el-button type="text" size="mini"
						  @click="openDialog('rule',data.id)" v-auth="'添加规则'">增加</el-button>
						  <el-button type="text" size="mini" @click="openDialog('rule',data)">修改</el-button>
						  <el-button type="text" size="mini" @click="deleteItem(data)">删除</el-button>
						</span>
					  </span>
					
				</el-tree>
			</el-tab-pane>
		</el-tabs>
		
		
		
		<div style="height: 60px;"></div>
		<el-footer v-if="preUrl != 'rule'" class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
		  <div style="flex: 1;" class="px-2">
			  <el-pagination
			    :current-page="page.current"
			    :page-sizes="page.sizes"
			    :page-size="page.size"
			    layout="total, sizes, prev, pager, next, jumper"
			    :total="page.total"
			    @size-change="handleSizeChange"
			    @current-change="handleCurrentChange">
			  </el-pagination>
		  </div>
		</el-footer>
		
		
		
		<el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="70%"
		  :before-close="handleClose">
		  
		  <!-- 添加/修改管理员 -->
		  <el-form v-if="preUrl ==='manager' " ref="form" :model="form.manager" label-width="80px">
		  	<el-form-item label="用户名" prop="username">
		  		<el-input v-model="form.manager.username" placeholder="用户名" size="mini" style="width: 25%;"></el-input>
		  	</el-form-item>
		  	<el-form-item label="密码" prop="password">
		  		<el-input v-model="form.manager.password" placeholder="密码" size="mini" style="width: 25%;"></el-input>
		  	</el-form-item>
		  	<el-form-item label="头像">
		  		<div>
		  			<span v-if="!form.manager.avatar" class="btn btn-light border mr-2"
		  			 @click="chooseImage">
		  				<i class="el-icon-plus"></i>
		  			</span>
		  			<img v-else :src="form.manager.avatar" class="rounded" style="width: 45px;height: 45px;cursor: pointer;" @click="chooseImage"/>
		  		</div>
		  	</el-form-item>
		  	<el-form-item label="所属角色">
		  		<el-select v-model="form.manager.role_id" placeholder="请选择所属角色"
		  		size="mini">
		  			<el-option v-for="(item,index) in roleOptions" :key="index"
		  			:label="item.name" 
		  			:value="item.id"></el-option>
		  		</el-select>
		  	</el-form-item>
		  	<el-form-item label="状态">
		  		<el-radio-group v-model="form.manager.status" size="mini">
		  			<el-radio :label="1" border>启用</el-radio>
		  			<el-radio :label="0" border>禁用</el-radio>
		  		</el-radio-group>
		  	</el-form-item>
		  </el-form>
		  <!-- 添加/修改角色 -->
		  <el-form v-if="preUrl ==='role' " ref="form" :model="form.role" label-width="80px">
		  	<el-form-item label="角色名称" prop="name">
		  		<el-input v-model="form.role.name" placeholder="角色名称" size="mini" style="width: 25%;"></el-input>
		  	</el-form-item>
		  	<el-form-item label="角色描述" prop="desc">
		  		<el-input type="textarea" v-model="form.role.desc" placeholder="角色描述" size="mini"></el-input>
		  	</el-form-item>
		  	<el-form-item label="状态">
		  		<el-radio-group v-model="form.role.status" size="mini">
		  			<el-radio :label="1" border>启用</el-radio>
		  			<el-radio :label="0" border>禁用</el-radio>
		  		</el-radio-group>
		  	</el-form-item>
		  </el-form>
		  <!-- 添加/修改规则 -->
		  <el-form v-if="preUrl ==='rule' " ref="form" :model="form.rule" label-width="100px">
			  <el-form-item label="上级规则">
			  	<el-select v-model="form.rule.rule_id" placeholder="请选择上级规则"
			  	size="mini">
					<el-option label="顶级规则" :value="0"></el-option>
			  		<el-option v-for="(item,index) in ruleOptions" :key="index"
			  		:label="item | tree" 
			  		:value="item.id"></el-option>
			  	</el-select>
			  </el-form-item>
			  <el-form-item label="菜单/规则">
			  	<el-radio-group v-model="form.rule.menu" size="mini">
			  		<el-radio :label="1" border>菜单</el-radio>
			  		<el-radio :label="0" border>规则</el-radio>
			  	</el-radio-group>
			  </el-form-item>
			  
		  	<el-form-item label="名称">
		  		<el-input v-model="form.rule.name" placeholder="名称" size="mini" style="width: 25%;"></el-input>
		  	</el-form-item>
			
			
			<el-form-item label="图标" v-if="form.rule.menu">
				<el-input v-model="form.rule.icon" placeholder="图标" size="mini"></el-input>
			</el-form-item>
			<el-form-item label="前端路由路径" v-if="form.rule.menu && form.rule.rule_id > 0">
				<el-input v-model="form.rule.frontpath" placeholder="前端路由路径" size="mini"></el-input>
			</el-form-item>
			<el-form-item label="前台路由别名" v-if="form.rule.menu">
				<el-input v-model="form.rule.desc" placeholder="前台路由别名" size="mini"></el-input>
			</el-form-item>

			
			<el-form-item label="后端规则" v-if="!form.rule.menu">
				<el-input v-model="form.rule.condition" placeholder="后端规则" size="mini"></el-input>
			</el-form-item>
			<el-form-item label="请求方式" v-if="!form.rule.menu">
				<el-select v-model="form.rule.method" placeholder="请选择请求方式"
				size="mini">
					<el-option label="GET" value="GET"></el-option>
					<el-option label="POST" value="POST"></el-option>
					<el-option label="PUT" value="PUT"></el-option>
					<el-option label="DELETE" value="DELETE"></el-option>
				</el-select>
			</el-form-item>
		  	
		  	<el-form-item label="状态">
		  		<el-radio-group v-model="form.rule.status" size="mini">
		  			<el-radio :label="1" border>启用</el-radio>
		  			<el-radio :label="0" border>禁用</el-radio>
		  		</el-radio-group>
		  	</el-form-item>
		  </el-form>
		  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submit">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 配置权限 -->
		<el-drawer
		  title="配置权限"
		  :visible.sync="drawer"
		  direction="rtl"
		  :before-close="handleClose"
		  size="40%">
		  <div style="position: absolute;top:52px;left: 0;right: 0;bottom: 0;">
			  <div style="position: absolute;top: 0;left: 0;right: 0;bottom: 60px;overflow-y: auto;">
				  <el-tree
				    :data="ruleList"
				    show-checkbox
				    node-key="id"
				    default-expand-all
				    :default-checked-keys="checkedKeys"
				    :props="defaultProps"
					:check-strictly="true"
					@check="check">
				  </el-tree>
			  </div>
			  <div style="height: 60px;position: absolute;bottom: 0;right: 0;left: 0;" class="border d-flex align-items-center px-3 bg-white">
			  	<el-button @click="drawer = false">取消</el-button>
			  	<el-button type="primary" @click="submitRules">确定</el-button>  
			  </div>
		  </div>
		</el-drawer>
		
	</div>
</template>

<script>
	import common from '@/common/mixins/common.js';
	export default {
		mixins:[common],
		inject:['app','layout'],
		data() {
			return {
				keyword:"",
				preUrl:"manager",
				managerList: [],

				roleList: [],
				
				ruleList: [],
				defaultProps: {
				  children: 'child',
				  label: 'name'
				},
				
				dialogVisible:false,
				dialogType:"manager",
				roleOptions:[],
				ruleOptions:[],
				dialogId:0,
				form:{
					manager:{
						username:"",
						password:"",
						avatar:"",
						role_id:"",
						status:1
					},
					role:{
						name:"",
						desc:"",
						status:1
					},
					rule:{
						menu:0,
						rule_id:"",
						name:"",
						status:1,
						frontpath:"",
						desc:"",
						condition:"",
						icon:"",
						method:"GET",
						order:50
					}
				},
				
				drawer: false,
				drawerId:0,
				checkedKeys:[]
			}
		},
		filters: {
			tree(item) {
				if (item.level == 0) {
					return item.name
				}
				let str = ''
				for (let i = 0; i < item.level; i++) {
					str += i == 0 ? '|--' : '--'
				}
				return str + ' ' +item.name;
			}
		},
		methods: {
			// 打开弹出层
			openDialog(type,item = false){
				// 确认类型
				this.dialogType = type
				// 初始化表单
				switch (type){
					case 'manager':
					if (!item) {
						this.form.manager = {
							username:"",
							password:"",
							avatar:"",
							role_id:"",
							status:1
						}
						this.dialogId = 0
					} else {
						this.form.manager = {
							username:item.username,
							password:item.password,
							avatar:item.avatar,
							role_id:item.role_id,
							status:item.status,
						}
						this.dialogId = item.id
					}
						break;
					case 'role':
					if (!item) {
						this.form.role = {
							name:"",
							desc:"",
							status:1
						}
						this.dialogId = 0
					} else {
						this.form.role = {
							name:item.name,
							desc:item.desc,
							status:item.status,
						}
						this.dialogId = item.id
					}
						break;
					case 'rule':
					if (!item || typeof item ==='number') {
						this.form.rule = {
							menu:0,
							rule_id:"",
							name:"",
							status:1,
							frontpath:"",
							desc:"",
							condition:"",
							icon:"",
							method:"GET",
							order:50
						}
						this.form.rule.rule_id = item
						this.dialogId = 0
					} else {
						this.form.rule = {
							menu:item.menu,
							rule_id:item.rule_id,
							name:item.name,
							status:item.status,
							frontpath:item.frontpath,
							desc:item.desc,
							condition:item.condition,
							icon:item.icon,
							method:item.method,
							order:50
						}
						this.dialogId = item.id
					}
						break;
				}
				// 显示弹出层
				this.dialogVisible = true
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
				  .then(_ => {
					done();
				  })
				  .catch(_ => {});
			},
			// 获取请求列表分页url
			getListUrl(){
				if (this.preUrl === 'manager') {
					return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.keyword}`
				}
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`
			},
			getListResult(e){
				console.log(e);
				switch (this.preUrl){
					case 'manager':
					this.managerList = e.list
					this.roleOptions = e.role
						break;
					case 'role':
					this.roleList = e.list
						break;
					case 'rule':
					this.ruleList = e.list
					this.ruleOptions = e.rules
						break;
				}
			},
			// 提交
			submit(){
				this.addOrEdit(this.form[this.preUrl],this.dialogId);
				this.dialogVisible = false
			},
			
			handleNodeClick(data) {
				console.log(data);
			},
			// 选择头像
			chooseImage(){
				this.app.chooseImage((res)=>{
					this.form.manager.avatar = res[0].url
				},1)
			},
			// 打开抽屉
			openDrawer(item){
				console.log(item);
				this.layout.showLoading()
				this.axios.get('/admin/rule/1',{
					token:true
				}).then(res=>{
					this.drawer = true
					this.ruleList = res.data.data.list
					this.checkedKeys = item.rules.map(item=>item.id)
					this.drawerId = item.id
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			},
			check(...e){
				this.checkedKeys = e[1].checkedKeys
			},
			submitRules(){
				this.axios.post('/admin/role/set_rules',{
					id:this.drawerId,
					rule_ids:this.checkedKeys
				},{
					token:true
				}).then(res=>{
					this.drawer = false
					this.getList()
					this.$message({
						type:"success",
						message:"配置成功"
					})
				})
			}
		},
	}
</script>

<style>
</style>
