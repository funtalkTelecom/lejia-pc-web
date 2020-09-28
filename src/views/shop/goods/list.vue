<template>

	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem; margin-bottom: 0!important;">
    		<el-tabs v-model="tabIndex" @tab-click="getList">
    		    <el-tab-pane :label="tab.name" :key="tabI"	v-for="(tab,tabI) in tabbars">
					<button-search ref="buttonSearch" placeholder="要搜索的商品名称"  @search="searchEvent">					
						<!-- 左边 button-search中slot name ="left"的内容-->
						<template #left>
							<router-link :to="{name:'shop_goods_create'}">
							  <el-button type="success" size="mini">发布商品</el-button>
							</router-link>
							<el-button type="danger" size="mini">批量删除</el-button>
						</template>
						
					<template #form>
						<div class="text item">
							<el-form inline ref="form" :model="form" label-width="80px">
								<el-form-item label="商品名称" class="mb-0">
									<el-input v-model="form.name"  placeholder="商品名称" size="mini"></el-input>
								</el-form-item>
								<el-form-item label="商品分类" class="mb-0">
									<el-select v-model="form.categoryId" placeholder="请选择商品分类" size="mini">
										<el-option v-for="item in cateOptions" :key="item.id"  :label="item | tree"   :value="item.id">
										</el-option>
									 </el-select>
								</el-form-item>
								<el-form-item class="mb-0">
									<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
									<el-button size="mini"	@click="clearSearch">清空筛选条件</el-button>
								</el-form-item>
							</el-form>
						</div>
					</template>									
					</button-search>
							
					<el-table  border class="mt-3" :data="tableData[tabI].list"   style="width: 100%" @selection-change="handleSelectionChange">
		              <el-table-column type="selection" width="45" 	align="center"> </el-table-column>
					  <el-table-column label="商品"	width="300">
						<template slot-scope="scope">
							<div class="media">
							  <img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.cover">
							  <div class="media-body">
								<p class="mt-0">{{scope.row.title}}</p>
								<p class="mb-0">分类：{{scope.row.category}}</p>
								<p class="mb-0">时间：{{scope.row.createTime}}</p>
							  </div>
							</div>
						</template>
					  </el-table-column>		  
	 				  <el-table-column	prop="type"	label="商品类型" width="180"></el-table-column>
					  <el-table-column	prop="createTime"	label="创建时间"></el-table-column>
					  <el-table-column 	prop="saleCount" label="实际销量" width="180"></el-table-column>
					  <el-table-column	prop="order" label="商品排序"  width="180"> </el-table-column>
					  <el-table-column	prop="status"	label="商品状态" width="150" align="center">
						  <template slot-scope="scope">
						
								<el-button type="success" size="mini" plain @click="scope.row.status=1">审核通过</el-button>
							    <el-button type="danger" size="mini" plain @click="scope.row.status=2" class="ml-0 mt-2">
									审核不过</el-button>			
						
<!-- 						      <el-button :type="scope.row.status? 'success':'danger'" size="mini" plain @click="changeStatus(scope.row)">
								  {{scope.row.status? '上架':'下架'}}</el-button> -->
						  </template>  
					  </el-table-column>
					  <el-table-column	prop="stock"	label="总库存" width="180"></el-table-column>
					  <el-table-column	prop="price"	label="价格(元)"></el-table-column>
					  <el-table-column 	label="操作" width="150">					  
						  <template slot-scope="scope">
							  <el-button-group>
								<el-button type="primary" size="mini" plain>修改</el-button>
								<el-button type="danger" size="mini" plain  @click="deleteItem(scope.$index)">删除</el-button>		      
							  </el-button-group>
						  </template>  						  
					  </el-table-column>
					  
					</el-table>
					
					<div style="height: 60px;"></div>
					<!-- position-fixed 默认是相对于浏览器窗口定位的 -->
					<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" 
					           style="bottom: 0;left: 200px;right: 0;z-index: 100;">
					  <div style="flex: 1;" class="px-2">
						  <el-pagination
							:current-page="tableData[tabI].currentPage"
							:page-sizes="[10,20,30,50]"
							:page-size="10"
							layout="total, sizes, prev, pager, next, jumper"
							:total="100">
						  </el-pagination>
					  </div>
					</el-footer>
											
				</el-tab-pane>
  		</el-tabs>
		


	</div>
</template>

<script>
    import buttonSearch from "@/components/common/button-search.vue"
	import common from '@/common/mixins/common.js';

	export default{
		   mixins:[common],
		   // inject:['layout'],
		   components:{buttonSearch},
			data() {
				return {					
				 tableData: [],
					multipleSelection: [],
					preUrl:"goods",
					superSearch:false,
					tabIndex: 0,
					tabbars:[
						{ name:"全部",key:"all"},
						{ name:"审核中",key:"checking"},
						{ name:"出售中",key:"saling"},
						{ name:"已下架",key:"off"},
						{ name:"库存预警" ,key:"min_stock"},
						{ name:"回收站" ,key:"delete"},
					],
					form:{
						name:"",
						categoryId:""
					},
					cateOptions:[{id:1,name:"审核中"},{id:2,name:"已下架"}]
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
			computed: {
				tab() {
					return this.tabbars[this.tabIndex].key 
				},
				params(){
					let str = ''
					for (let key in this.form) {
						let val = this.form[key]
						if(val){
							str += `&${key}=${this.form[key]}`
						}
					}
					return str
				}
			},
			created() {
				this.getData()
			},
			methods: {
				
				getData(){
					for(let i=0; i<this.tabbars.length;i++){
						
						this.tableData.push({
							currentPage:1,
							list:[]
						})
						
						for(let j=0; j<10; j++){
							
							this.tableData[i].list.push({					
								id: j,
								title: '乐语通信 中国联通 5A 北京超级靓号'+i+'--'+j,
								cover: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893044939,2959142289&fm=26&gp=0.jpg',
								createTime: '2020-05-04 17:10:01',
								category:'手机号码',
								type:'普通商品',
								saleCount:'20',
								order:j+1,
								status:true,
								stock:200,
								price:1000,
								isCheck:1							
							})
						}
					}
					
				},
				
				
				navigate(name,id){
					this.$router.push({
						name,
						params:{ id }
					})
				},
				// 获取请求列表分页url
				getListUrl(){
					return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`
				},
				getListResult(e){
					console.log(e);
					this.tableData = e.list
					this.cateOptions = e.cates
				},
				// 上下架
				changeStatus(item){
					item.status = item.status === 1 ?  0 : 1
				},
				// 清空筛选条件
				clearSearch(){
					this.form = {
						name:"",
						categoryId:""
					}
					
                this.$refs.buttonSearch[this.tabIndex].closeSuperSearch()
				},
				// 搜索事件
				searchEvent(e = false){
					// 简单搜索
					if (typeof e === 'string') {
						this.form.name = e
												
					}
					
					console.log(e)
					
					
					// 高级搜索
					//this.getList()
				},
				doEvent(key){
					if (this.ids.length === 0) {
						return this.$message({
							type:"error",
							message:"请选择要操作的商品"
						})
					}
					this.showLoading()
					this.axios.post('/admin/goods/'+key,{
						ids:this.ids
					},{
						token:true
					}).then(res=>{
						this.$message({
							type:"success",
							message:"操作成功"
						})
						this.getList()
						this.hideLoading()
					}).catch(err=>{
						this.hideLoading()
					})
				},
				// 上下架
				changeStatus(status){
					if (this.ids.length === 0) {
						return this.$message({
							type:"error",
							message:"请选择要操作的商品"
						})
					}
					this.showLoading()
					this.axios.post('/admin/goods/changestatus',{
						ids:this.ids,
						status
					},{ token:true }).then(res=>{
						this.$message({
							type:"success",
							message:"操作成功"
						})
						this.getList()
						this.hideLoading()
					}).catch(err=>{
						this.hideLoading()
					})
				},
				checkGoods(item,ischeck){
					this.layout.showLoading()
					this.axios.post('/admin/goods/'+item.id+'/check',{
						ischeck
					},{ token:true }).then(res=>{
						this.getList()
						this.$message({
							type:"success",
							message:"操作成功"
						})
						this.layout.hideLoading()
					}).catch(err=>{
						this.layout.hideLoading()
					})
				},
				  handleSelectionChange(val) {
					this.multipleSelection = val;
				  },
				//删除当前项
				deleteItem(index){
					
					this.tableData[this.tabIndex].list.splice(index,1)
					
				},
				
				changeStatus(row){
					row.status=!row.status
				}
				
			}
		
		
	}
	
</script>

<style>
</style>
