var Intro=function(){

	var initIntro=function(){

			
		$.ajax({
			url:"/ajaxintro?jsajax=1&amount=5",
			type:"get",
			success:function(data){
				if(data.success==403){
					$("#signin").trigger('ajax')

				}else{
				

				data.forEach(function(intro,index){
					var str="<div class=\"item\">"
	                  	+"<a href=\"shop-item.html\">"
	                  	+"<img src=\"http://7xioyb.com1.z0.glb.clouddn.com/@/product/"+intro.picPath+"?imageView2/1/w/65/h/60/interlace/1\" alt=\""+intro.keywords+"\"></a>"
	                  	+"<h3><a href=\"/product?id="+intro.product_id+"&did="+intro.differ_id+"\">"+intro.productName+"</a></h3>"
	                  	+"<div class=\"price\">$"+(intro.differPrice/100).toFixed(2)+"</div>"
	                  	+"</div>"

	                 $("#intro").append(str)

	  
				})
			}

				
				
			}

			
		})

		


	}


	return {
		init:function(){
			initIntro()
		}
	};


}();