<template>
	
	<el-form ref="form" label-width="80px">
		<el-form-item label="商品名称">
			<el-input size="mini"   :value="title"  @input="vModel('title',$event)"  placeholder="请输入商品名称，不能超过60个字符" class="w-50"></el-input>
		</el-form-item>				
		<el-form-item label="商品分类">
			<el-cascader size="mini" :value="category"  @input="vModel('category',$event)"  :options="options"></el-cascader>
		</el-form-item>
				
	<el-form-item label="商品描述">
			<el-input size="mini" type="textarea"  :value="desc"  @input="vModel('desc',$event)"  class="w-50" placeholder="选填,商品卖点简述"></el-input>
	</el-form-item>
	<el-form-item label="商品单位">
			<el-input size="mini"  :value="unit"  @input="vModel('unit',$event)"   class="w-25" placeholder="请输入单位"></el-input>
	</el-form-item>					
	<el-form-item label="总库存">
		  <el-input  size="mini" type="number" placeholder="请输入内容"  :value="stock"  @input="vModel('stock',$event)"  class="w-25">
			    <template slot="append">件</template>
			  </el-input>
		</el-form-item>					
	<el-form-item label="库存预警">
		  <el-input  size="mini" type="number" placeholder="请输入内容" :value="minStock"  @input="vModel('minStock',$event)"  class="w-25">
			    <template slot="append">件</template>
			  </el-input>
		</el-form-item>						
	<el-form-item label="库存显示">
		  				<el-radio-group size="mini" :value="displayStock"  @input="vModel('displayStock',$event)" >
							<el-radio :label="1" border>是</el-radio>
		  					<el-radio :label="0" border>否</el-radio>
		  				</el-radio-group>
		</el-form-item>		
		
	<el-form-item label="是否上架">
		  				<el-radio-group size="mini"  :value="status"  @input="vModel('status',$event)" >
		  					<el-radio :label="0" border>放入仓库</el-radio>
		  					<el-radio :label="1" border>立即上架</el-radio>
		  				</el-radio-group>				
	</el-form-item>		
	<el-form-item label="运费模板">
		<el-select size="mini"  :value="express"  @input="vModel('express',$event)"  placeholder="请选择运费模板">
			<el-option :label="item.name" v-for="(item,index) in express" :key="index"  :value="item.id"></el-option>
		</el-select>
	</el-form-item>	
		
	</el-form>
	
	
</template>

<script>
  import {mapState,mapMutations} from  'vuex'
  
  export default{
	  
	  data:function() {
return {
		  
		  options: [{
		    value: 'zhinan',
		    label: '指南',
		    children: [{
		  	value: 'shejiyuanze',
		  	label: '设计原则',
		  	children: [{
		  	  value: 'yizhi',
		  	  label: '一致'
		  	}, {
		  	  value: 'fankui',
		  	  label: '反馈'
		  	}]
		    }, {
		  	value: 'daohang',
		  	label: '导航',
		  	children: [{
		  	  value: 'cexiangdaohang',
		  	  label: '侧向导航'
		  	}]
		    }]
		  }, {
		    value: 'zujian',
		    label: '组件',
		    children: [{
		  	value: 'basic',
		  	label: 'Basic',
		  	children: [{
		  	  value: 'layout',
		  	  label: 'Layout 布局'
		  	}, {
		  	  value: 'color',
		  	  label: 'Color 色彩'
		  	}]
		    }, {
		  	value: 'form',
		  	label: 'Form',
		  	children: [{
		  	  value: 'radio',
		  	  label: 'Radio 单选框'
		  	}]
		    }, {
		  	value: 'data',
		  	label: 'Data',
		  	children: [{
		  	  value: 'table',
		  	  label: 'Table 表格'
		  	}]
		    }, {
		  	value: 'notice',
		  	label: 'Notice',
		  	children: [{
		  	  value: 'alert',
		  	  label: 'Alert 警告'
		  	}]
		    }, {
		  	value: 'navigation',
		  	label: 'Navigation',
		  	children: [{
		  	  value: 'menu',
		  	  label: 'NavMenu 导航菜单'
		  	}]
		    }, {
		  	value: 'others',
		  	label: 'Others',
		  	children: [{
		  	  value: 'dialog',
		  	  label: 'Dialog 对话框'
		  	}, {
		  	  value: 'tooltip',
		  	  label: 'Tooltip 文字提示'
		  	}]
		    }]
		  }, {
		    value: 'ziyuan',
		    label: '资源',
		    children: [{
		  	value: 'axure',
		  	label: 'Axure Components'
		    }, {
		  	value: 'sketch',
		  	label: 'Sketch Templates'
		    }]
		  }]
		  
		  
	  };
},
	  computed:{
	  	...mapState({
	  		title:state =>state.goods_create.title,
	  		category:state =>state.goods_create.category,
	  		cover:state =>state.goods_create.cover,
	  		desc:state =>state.goods_create.desc,
	  		unit:state =>state.goods_create.unit,
	  		stock:state =>state.goods_create.stock,
	  		minStock:state =>state.goods_create.minStock,
	  		displayStock:state =>state.goods_create.displayStock,
	  		ischeck:state =>state.goods_create.ischeck,
	  		status:state =>state.goods_create.status,
	  		express:state =>state.goods_create.express,
	  		
	  	}),
	  },
	  
	  methods:{
	  	
	  	...mapMutations(['vModelState']),

	  	vModel(key,value){
	  		
	  		this.vModelState({key,value})
	  	}
	  	
	  }
	  
  }
  
</script>

<style>
</style>
