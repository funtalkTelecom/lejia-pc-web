<template>
  <div id="app">
  
	<router-view></router-view>
    <image-dialog ref="imageDialog" :max="maxChooseImage"></image-dialog>
	<skus-dialog ref="skusDialog"></skus-dialog>

  </div>
</template>

<script>
    import imageDialog from '@/components/image/image-dialog.vue';
	import skusDialog from '@/components/skus/skus-dialog.vue';


export default {
		components: {
			imageDialog,skusDialog
		 },
        name: 'app',
		// 依赖注入  子组件就可以通过 app.xxxx() 调用此组件的方法, 如 app.show()；
		provide(){
			return {
				app:this
			}
		},
		data() {
			return {
				maxChooseImage: 9,
				imageModel:false,
				callback:false
				
			}
		},
		mounted() {
			// 浏览器刷新 会清空state,通过此事件在清空之前保存到sessionStorage中
			window.addEventListener("unload",()=>{
			    sessionStorage.setItem("menuRules",JSON.stringify(this.$store.state.menu.menuRules))
			})
		},
		created() { // 主要解决用户登录后，浏览器刷新的问题，刷新会清空所有state,重构App.vue,即执行created方法
			// 初始化用户信息
			this.$store.commit('initUser')
			// 初始化菜单和操作权限
		    this.$store.commit('initPermission')
						
		},
		
		methods: {
			
			// chooseImage(callback){
			// 	this.callback =callback
			// 	this.imageModel=true
			// },
			
			confirm(){
				
				if(typeof callback  === 'function')
				callback(123)
				this.hide()		
			},
			hide(){
				this.imageModel=false
				this.callback=false
			},
			
			//选择图片
			chooseImage(callback,max = 2) {
				this.maxChooseImage = max
				// 调用子组件的chooseImage方法
				this.$refs.imageDialog.chooseImage(callback)
			},
			// 选择规格
			chooseSkus(callback){
				this.$refs.skusDialog.chooseSkus(callback)
			}
		},
}
</script>

<style>
/* 滚动条的样式  火狐浏览器不生效 谷歌没有问题*/
::-webkit-scrollbar-track
{
  background: rgba(0,0,0,.1);
  border-radius: 0;
}

::-webkit-scrollbar
{
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb
{
    cursor: pointer;
    border-radius: 5px;
    background: rgba(0,0,0,.25);
    transition: color .2s ease;
}

.el-card{
	box-shadow: 0 1px 1px  rgba(0,0,0,0.15)!important;
}


</style>
