var Newp=function(){

	var initNewp=function(){

		$.ajax({
			url:"/ajaxnewp",
			type:"get",
			success:function(data){
				if(data.success==403){
					$("#signin").trigger('ajax')

				}else{
				$("#newp").empty()



				data.forEach(function(newer,index){
					var str="<div class=\"col-md-3 col-sm-4 col-xs-6\">"
	                  	+"<div class=\"product-item\">"
	                  	+"<div class=\"pi-img-wrapper\">"
	                  	+"<a href=\"/product/?id="+newer._id+"\"><img src=\"http://7xioyb.com1.z0.glb.clouddn.com/@/product/"+newer.differShow.picPath+"?imageView2/1/w/225/h/300/interlace/1\" class=\"img-responsive\" alt=\""+newer.productName+"...\"></a>"
	                  	+"</div>"
	                  	+"<h3><a href=\"/product/?id="+newer._id+"\">"+newer.productName.substr(0,18)+"...</a></h3>"
	                  	+"<div class=\"pi-price\">$"+(newer.differShow.differPrice/100).toFixed(2)+"</div>"
	                  	+"<button  data-bid=\""+newer.brand_id+"\" data-pid=\""+newer._id+"\" data-did=\""+newer.differShow._id+"\" class=\"btn btn-default add2cart\">加入购物车</button>"
	                  	+"<div class=\"sticker sticker-new\"></div>"
	                  	+"</div>"
	                  	+"</div>"

	                 $("#newp").append(str)

	  
				})
				v()
			}

				
				
			}

			
		})

		


	}


	return {
		init:function(){
			initNewp()
		}
	};


}();