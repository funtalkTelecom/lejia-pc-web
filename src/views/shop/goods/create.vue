<template>
	<div class="bg-white px-3 goods_create" style="margin: -20px;margin-top: -1rem; margin-bottom: 0!important;">
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute; top:12px; right: 10px;">
			<el-button size="mini">返回商品列表页面</el-button>
		</router-link>
		
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
		    <el-tab-pane label="基础设置"> 
			    <!-- 封装组件之:基础设置 base-create -->
				<base-create></base-create>
			</el-tab-pane>
			
			<el-tab-pane label="商品规格" >	
				<el-form  label-width="80px">
					<el-form-item label="商品规格">
						<el-radio-group  :value="skusType"  @input="vModel('skusType',$event)" size="mini">
							<el-radio-button :label="0">单规格</el-radio-button>
							<el-radio-button :label="1">多规格</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-form>
					
				<!-- 规格选项   单规格 -->
				<template  v-if="skusType===0">
				   <!-- 封装组件之:单规格 single-attrs -->
				   <single-attrs></single-attrs>
				</template>
				<!-- 规格选项   多规格 -->
				<template v-else>
				   
				   <!-- 规格卡片 -->
				   <el-form ref="form" label-width="80px">
					  <el-form-item label="添加规格">
						  <sku-card  v-for="(item,index) in skuCard" :key="index" 
									:item="item" :index="index" :total="skuCard.length"></sku-card>
						<el-button size="mini" type="success" @click="addSkuCard" >添加规格</el-button>   		
					</el-form-item>		   
					</el-form>
					<el-form ref="form" label-width="80px">
						<el-form-item label="批量设置">
							<template v-if="!updateAllStatus">
								<el-button type="text"	v-for="(btn,btnIndex) in updateList" :key="btnIndex"
									@click="openUpdateAllStatus(btn)">{{btn.name}}</el-button>
							</template>
							<div v-else class="d-flex align-items-center">
								<el-input size="small" style="width: 150px;" class="mr-2" type="number" v-model="UpdateAllValue" :placeholder="UpdateAllPlaceholder"></el-input>
								<el-button type="primary" size="mini" @click="UpdateAllSubmit">设置</el-button>
								<el-button size="mini" @click="closeUpdateAllStatus">取消</el-button>
							</div>				
						</el-form-item>
						<el-form-item label="规格设置">
							<sku-table ref="table"></sku-table>
						</el-form-item>
					</el-form>
				</template>	
			</el-tab-pane>
			
			<el-tab-pane label="商品属性">	
				<el-form ref="form" label-width="80px">
					<el-form-item label="商品类型">
						<el-select :value="goodsTypeId" @change="vModel('goodsTypeId',$event)" placeholder="请选择商品类型">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>商品属性</span>
					</div>
					<el-form ref="form" label-width="80px">
						<el-form-item label="手机型号" >
							<el-input :value="goodsAttrs.phoneModel" placeholder="请输入手机型号" 
							          @input="vModelGoodsAttrs({ key:'phoneModel',value:$event })">
							</el-input>
						</el-form-item>
					</el-form>
				</el-card>				
			</el-tab-pane>
			
			<el-tab-pane label="媒体设置">	
				<el-form label-width="80px">
					<el-form-item label="商品大图">
						<div class="d-flex flex-wrap">			
							<div style="width: 150px;height: 150px;cursor: pointer;position: relative;" 
							     class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3" 
								 @click="chooseImage(index)" v-for="(item,index) in banners" :key="index">
								<img v-if="item.url" :src="item.url"  style="width: 100%;height: 100%;"/>
								<i v-else class="el-icon-plus text-muted" style="font-size: 30px;"></i>					
								<i class="el-icon-delete p-2 text-white" style="position: absolute;top: 0;right: 0;background-color: rgba(0,0,0,0.4);" 
								   @click.stop="deleteImage(index)"></i>
							</div>
							<div v-if="banners.length < 9" style="width: 150px;height: 150px;cursor: pointer;" 
							     class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3" 
								 @click="chooseImage(-1)">
								<i class="el-icon-plus text-muted"  style="font-size: 30px;"></i>
							</div>
						</div>				
					</el-form-item>
				</el-form>			
			</el-tab-pane>
			
			<el-tab-pane label="商品详情">				
			    <!-- 富文本编辑器 -->
				<tinymce ref="editor" v-model="msg" @onClick="onClick" />
			</el-tab-pane>
					
			<el-tab-pane label="折扣设置">
				<el-form ref="form" label-width="80px">
					<el-form-item label="会员价">
						<el-input :value="discount" @input="vModel('discount',$event)">
							<template slot="append">%</template>
						</el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
	
</template>

<script>
	
	import {mapState,mapMutations} from  'vuex'
	import baseCreate from '@/components/shop/base-create.vue'
	import singleAttrs  from '@/components/shop/single-attrs.vue'
	import skuCard  from '@/components/shop/create/sku-card.vue'
	import skuTable from '@/components/shop/create/sku-table.vue';
	import tinymce from '@/components/common/tinymce.vue';
	
	export default{
		inject:['app'],
		components:{baseCreate,singleAttrs,skuCard,skuTable,tinymce},
		
		data(){
          return {
				msg: 'Welcome to Use Tinymce Editor',
				tabIndex:0,
				id:0,
				cates:[],
				// 批量修改
				updateList:[{
					name:"销售价",
					key:"pprice"
				},{
					name:"市场价",
					key:"oprice"
				},{
					name:"成本价",
					key:"cprice"
				},{
					name:"库存",
					key:"stock"
				},{
					name:"体积",
					key:"volume"
				},{
					name:"重量",
					key:"weight"
				}],
				updateAllStatus:false,
				UpdateAllPlaceholder:"",
				UpdateAllValue:""
          }
		},
		
		computed:{
			
			...mapState({
				skusType:state =>state.goods_create.skusType,	
				skuCard:state =>state.goods_create.skuCard,
				banners:state=>state.goods_create.banners,
				goodsTypeId:state=>state.goods_create.goodsTypeId,
				goodsAttrs:state=>state.goods_create.goodsAttrs,
				discount:state=>state.goods_create.discount,
			}),

		},
		mounted(){
		},
		
		methods:{
			
			...mapMutations(["vModelState","addSkuCard",'vModelGoodsAttrs']),
			handleClick(e){		
				console.log(e)
			},
			
			vModel(key,value){			
				this.vModelState({key,value})
			},
			
			// 鼠标单击的事件
			onClick (e, editor) {
				console.log('Element clicked')
				console.log(e)
				console.log(editor)
			},
			// 修改批量设置状态
			openUpdateAllStatus(item){
				this.updateAllStatus = item.key
				this.UpdateAllPlaceholder = item.name
			},
			// 取消批量设置状态
			closeUpdateAllStatus(){
				this.updateAllStatus = false
				this.UpdateAllValue = ""
			},
			// 提交批量设置
			UpdateAllSubmit(){
				this.$refs.table.list.forEach(item=>{
					item[this.updateAllStatus] = this.UpdateAllValue
				})
				this.closeUpdateAllStatus()
			},
			// 选择图片
			chooseImage(index){
				const MAX = 9
				let count = MAX - this.banners.length
				this.app.chooseImage((res)=>{	
					
					let list = []
					if (index === -1) {
						list = [...this.banners,...res]
					} else {
						list = [...this.banners]
						list[index] = res[0]
					}
					this.vModel('banners',list)
				},index === -1 ? count : 1)
			},
			
			// 删除大图
			deleteImage(index){
				this.$confirm('是否要删除该图片?', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let list = [...this.banners]
					list.splice(index,1)
					this.vModel('banners',list)
				})
			},		
		}
		
	}
	
</script>

<style>
	
.goods_create .el-form-item{
	margin-bottom:0px ;
}	
	
</style>
