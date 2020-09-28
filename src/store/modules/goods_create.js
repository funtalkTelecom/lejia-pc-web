import $Util from '@/common/util.js'
export default{
	
	state:{
			skusType:0,
			title:"",
			category:[],
			cover:"",
			desc:"",
			unit:"",
			stock:0,
			minStock:0,
			displayStock:0,
			ischeck:0,
			status:0,
			express:"",
			banners:[], // 商品大图
			oprice:0, // 市场价格
			pprice:0, // 销售价格
			cprice:0, // 成本价格
			weight:0, // 重量
			volume:0, // 体积
		    // 规格卡片
			skuCard:[{
				         name:"颜色",
						  type: 0,  // 0 无 1 颜色  2 图片
						  list:[{name:"黄色",image:"",color:""},{name:"红色",image:"",color:""}]
			           },{
						  name:"颜色",
						  type: 0,  // 0 无 1 颜色  2 图片
						  list:[{name:"黄色",image:"",color:""},{name:"红色",image:"",color:""}]
			        }], 
			// 商品类型
			goodsTypeId:"",
			// 商品属性
			goodsAttrs:{
				phoneModel:"华为P30"
			},
			// 折扣
			discount:0,
			// 表头
			ths: [
				{ name:"商品规格",rowspan:1,colspan:1,width:""},
				{ name:"sku图片",rowspan:2,width:"60" },
				{ name:"销售价",rowspan:2,width:"100" },
				{ name:"市场价",rowspan:2,width:"100" },
				{ name:"成本价",rowspan:2,width:"100" },
				{ name:"库存",rowspan:2,width:"100" },
				{ name:"体积",rowspan:2,width:"100" },
				{ name:"重量",rowspan:2,width:"100" },
				{ name:"编码",rowspan:2,width:"100" },
			],
			
			
			
	},
	getters:{
		
			skuLabels(state){
				return state.skuCard.filter(v=>{
					return v.list.length > 0
				})
			},
			// 获取表头
			tableThs(state,getters){
				let  length = getters.skuLabels.length
				state.ths[0].colspan = length
				state.ths[0].rowspan = length > 0 ? 1 : 2
				return state.ths
			},
			// 获取规格表格数据
			tableData(state){
				// 当前是否有规格卡片
				if (state.skuCard.length === 0) {
					return [];
				}
				let sku_list = []
				for (var i = 0; i < state.skuCard.length; i++) {
					if (state.skuCard[i].list.length > 0) {
						sku_list.push(state.skuCard[i].list)
					}
				}
				if (sku_list.length === 0) {
					return []
				}
				let arr = $Util.cartesianProductOf(...sku_list)
				return arr.map(v=>{
					let obj = {
						skus:[],
						image:"", // sku图片
						pprice:0, // 销售价格
						oprice:0, // 市场价格
						cprice:0, // 成本价格
						stock:0,
						volume:0,
						weight:0,
						code:''
					}
					obj.skus = v
					return obj
				})
			}	
		
		
		
	},
	mutations:{	
		// 修改state
		vModelState(state,{key,value}){
			
			console.log(value)
			state[key] = value
		},	
		// 增加规格卡片
		addSkuCard(state){
			state.skuCard.push({name:"颜色",
			                     type: 0, 
					             list:[]
			})
		},
		
		// 删除规格卡片
		delSkuCard(state,index){
			state.skuCard.splice(index,1)
		},
		// 修改规格卡片
		vModelSkuCard(state,{key,index,value}){
			state.skuCard[index][key] = value
		},
		// 规格卡片排序
		sortSkuCard(state,{action,index}){
			// 上移  action是util中的方法名称
			$Util[action](state.skuCard,index)
		},
		// 增加指定规格卡片的规格属性
		addSkuValue(state,index){
		//	state.skuCard[index].list.push(data)
    		state.skuCard[index].list.push({name:"规格名称",
			                     image:"", 
					             color:""})
		},
		// 删除指定规格卡片的规格属性
		delSkuValue(state,{cardIndex,valueIndex}){
			state.skuCard[cardIndex].list.splice(valueIndex,1)
		},
		// 修改指定规格卡片的规格属性
		updateSkuValue(state,{cardIndex,valueIndex,key,value}){
			state.skuCard[cardIndex].list[valueIndex][key] = value
		},
		// 排序规格卡片的规格属性列表
		sortSkuValue(state,{index,value}){
			state.skuCard[index].list = value
		},
		// 修改商品属性
		vModelGoodsAttrs(state,{key,value}){
			state.goodsAttrs[key] = value
		},
		
		
	},
	actions:{
		
	}

}