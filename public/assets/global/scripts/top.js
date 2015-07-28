var Top=function(){

	var initTop=function(){

		
		$.ajax({
			url:"/ajaxtop?jsajax=1&amount=10",
			type:"get",
			success:function(data){
				if(data.success==403){
					$("#signin").trigger('ajax')

				}else{
				

				data.forEach(function(top,index){
					var str="<div class=\"item\">"
	                  	+"<a href=\"shop-item.html\">"
	                  	+"<img src=\"http://7xioyb.com1.z0.glb.clouddn.com/@/product/"+top.picPath+"?imageView2/1/w/65/h/60/interlace/1\" alt=\""+top.keywords+"\"></a>"
	                  	+"<h3><a href=\"/product?id="+top.product_id+"&did="+top.differ_id+"\">"+top.productName+"</a></h3>"
	                  	+"<div class=\"price\">$"+(top.differPrice/100).toFixed(2)+"</div>"
	                  	+"</div>"

	                 $("#top").append(str)

	  
				})
			}

				
				
			}

			
		})

		


	}


	return {
		init:function(){
			initTop()
		}
	};


}();