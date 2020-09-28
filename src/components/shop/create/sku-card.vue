<template>
	<!-- 规格卡片 -->
	<div class="card mb-2" style="line-height: 1.2;">
		<div class="card-header d-flex align-items-center">
				规格项：
				<el-input size="mini" style="width: 200px;" :value="item.name" @input="vModel('name',index,$event)">
					<el-button slot="append" icon="el-icon-more" @click="chooseSkus"></el-button>
				</el-input>
				<el-radio-group size="mini" style="margin-bottom: -10px; margin-left: 20px;" :value="item.type" @input="vModel('type',index,$event)">
					<el-radio :label="0">无</el-radio>
					<el-radio :label="1">颜色</el-radio>
					<el-radio :label="2">图片</el-radio>								
				</el-radio-group>
			
			<el-button icon="el-icon-top" size="mini" :disabled="index ===0" class="ml-auto" @click="sortCard('moveUp',index)"></el-button>
			<el-button icon="el-icon-bottom" size="mini" :disabled="index === total-1 " @click="sortCard('moveDown',index)"></el-button>
			<el-button type="text" @click="delSkuCard(index)">删除</el-button>						
		</div>
		<div class="card-body">			
				<!-- 规格属性列表 -->
			<div class="d-flex align-items-center flex-wrap">
			 <sku-card-children :type="item.type"
			      v-for="(item2,index2) in item.list" :key="index2" :item="item2" :cardIndex="index" :index="index2"></sku-card-children>
			</div>	
				
			<div>
				<el-button type="text" size="mini" icon="el-icon-plus"  @click="addSkuValue(index)">增加规格值</el-button>
			</div>				
		</div>
		
	</div>
		
</template>

<script>
  
  import {mapMutations} from  'vuex'
  import skuCardChildren from './sku-card-children.vue'

export default{
	
	inject:['app'],
	components:{skuCardChildren},
    props:{
		item:Object,
		index:Number,
		total:Number
	    },
	data(){
		return {
				type: {
					type: Number,
					default: 1
				},
		}
	},
	// 如果是遍历data()中的参数，则需要监听外部数据源的变化,否则外部变化，页面不会跟着变化
	// 不会变化主要原因是 data()中的参数是内部变量，不是全局变量；
	// mounted() {
	// 	this.$watch('item.list',(newValue,oldValue)=>{
			
	// 		console.log(newValue)
	// 	})
	// },
	
	methods:{
		
		...mapMutations(["delSkuCard","vModelSkuCard","sortSkuCard","addSkuValue"]),
		
		vModel(key,index,value){
			this.vModelSkuCard({key,index,value})
		},
		
		// 排序规格卡片
		sortCard(action,index){
			this.sortSkuCard({action,index})

		},
		addSkuValueEvent(value = false){
			
			
			// this.layout.showLoading()
			// this.axios.post('/admin/goods_skus_card_value',{
			// 	goods_skus_card_id:this.item.id,
			// 	name:this.item.name,
			// 	order:50,
			// 	value:typeof value === 'string' ? value : defaultVal[this.item.type]
			// },{ token:true }).then(res=>{
			// 	let data = res.data.data
			// 	data.text = this.item.type === 0 ? data.value : defaultVal[0]
			// 	data.color = this.item.type === 1 ? data.value : defaultVal[1]
			// 	data.image = this.item.type === 2 ? data.value : defaultVal[2]
			// 	this.addSkuValue({
			// 		index:this.index,
			// 		data
			// 	})
			// 	this.layout.hideLoading()
			// }).catch(err=>{
			// 	this.layout.hideLoading()
			// })
		},
		delSkuValueEvent(){},
		// 选择规格
		chooseSkus(){
			this.app.chooseSkus((res)=>{
				
				console.log(res)
				this.vModel('name',this.index,res.name)
				this.vModel('type',this.index,res.type)
				 this.vModel('list',this.index,res.list)
				 this.list = res.list
				// res.list.forEach(item=>{
				// 	this.addSkuValueEvent(item.name)
				// })
			})
		}
		

	}
}	
	
	
	
</script>

<style>
</style>
