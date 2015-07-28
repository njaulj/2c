var Brand=function(){

	
	var initBrand=function(){	

		$.ajax({
			url:"/ajaxbrands?isajax=1",
			type:"get",
			success:function(data){
				if(data.success==403){
					$("#signin").trigger('ajax')

				}else{
					$("#brands").empty()
					data.forEach(function(brand,index){
						console.log(brand)
						var str="<a href=\"/productlist?id="
							+brand._id
							+"\">"
							+"<img src=\"http://7xioyb.com1.z0.glb.clouddn.com/@/brand/"
							+brand.brandPic
							+"?imageMogr2/thumbnail/165x100!/interlace/1\" alt=\""
							+brand.brandName
							+"\" title=\""
							+brand.brandName
							+"\"></a>"

					$("#brands").append(str)

					})
					            Layout.initOWL();


			
				}
		}

			
		})

		


	}


	return {
		init:function(){
			initBrand()
		}
	};


}();