<template>
	
	<el-form>
		<el-form-item label="市场价格">
	      <el-input  size="mini" type="number" :min="0" :value="oprice"  @input="vModel('oprice',$event)" class="w-25">
		    <template slot="append">元</template>
		  </el-input>
	     </el-form-item>
		 
		 <el-form-item label="销售价格">
		   <el-input  size="mini" type="number" :min="0" :value="pprice"  @input="vModel('pprice',$event)" class="w-25">
		     <template slot="append">元</template>
		   </el-input>
		  </el-form-item>
		  <el-form-item label="成本价格">
		    <el-input  size="mini" type="number" :min="0" :value="cprice"  @input="vModel('cprice',$event)"  class="w-25">
		      <template slot="append">元</template>
		    </el-input>
		   </el-form-item>
		   <el-form-item label="商品重量">
		     <el-input  size="mini" type="number" :min="0" :value="weight"  @input="vModel('weight',$event)" class="w-25">
		       <template slot="append">克</template>
		     </el-input>
		    </el-form-item>			
			<el-form-item label="商品体积">
			  <el-input  size="mini" type="number" :min="0" :value="volume"  @input="vModel('volume',$event)" class="w-25">
				<template slot="append">立方米</template>
			  </el-input>
			 </el-form-item>				 
					 
	</el-form>	
	
	
</template>

<script>
	
	import {mapState,mapMutations} from  'vuex'
	  
	  export default{
		  
	  data: function() {
return {

	    };
},
	  computed:{
		...mapState({
			oprice:state =>state.goods_create.oprice,
			pprice:state =>state.goods_create.pprice,
			cprice:state =>state.goods_create.cprice,
			weight:state =>state.goods_create.weight,
			volume:state =>state.goods_create.volume,			
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
