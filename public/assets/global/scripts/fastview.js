   $(".fancybox-fast-view").click(function(){
              $.ajax({
                url:"/ajaxsp?pid="+$(this).data("pid")+"&did="+$(this).data("did")+"&isajax=1",
                type:"get",
                success:function(result){

                	$("#fcart").attr("disabled",false)
                	var pstr=""

                //	console.log(result)
					$(".zoomImg").remove()
                	$("#fpic").attr("src","http://7xioyb.com1.z0.glb.clouddn.com/@/product/"+result.differShow.picPath+"?imageView2/1/w/330/h/330/interlace/1")
                	$("#fpic").attr("data-BigImgsrc","http://7xioyb.com1.z0.glb.clouddn.com/@/product/"+result.differShow.picPath)

				//	$(".zoomImg").attr("src","http://7xioyb.com1.z0.glb.clouddn.com/@/product/"+result.differShow.picPath)

					$("#fproductName").text(result.product.productName+"-"+result.differShow.differName)
                  	$("#fdifferPrice").text((result.differShow.differPrice/100).toFixed(2))
                  	$("#fmarketPrice").text((result.differShow.marketPrice/100).toFixed(2))
                  	$("#fonsale").text(parseFloat((result.differShow.differPrice/result.differShow.marketPrice)*10).toFixed(1)+"折")
                	$("#fdescription").html("<p>"+result.product.shortDesp+"</p>")
                	var str = "<option data-pid=\""
                	+result.differShow.product_id
                	+"\" data-did=\""
                	+result.differShow._id
                	+"\" data-bid=\""
                	+result.product.brand_id
                	+"\" data-pic=\""
                	+result.differShow.picPath
                	+"\" data-price=\""
                	+result.differShow.differPrice
                	+"\" data-market=\""
                	+result.differShow.marketPrice
                	+"\">"+result.differShow.differName+"</option>"
                	$("#fdiffer").empty()
                	$("#fproduct-other-images").empty()

                	//$("#differ").append(str)
                	//console.log(result.differs.length)
                	result.differs.forEach(function(dif,index){

    					pstr+="<a href=\"http://7xioyb.com1.z0.glb.clouddn.com/@/product/"
    					+dif.picPath
    					+"\" class=\"fancybox-button\" rel=\"photos-lib\"><img alt=\""
    					+dif.differName
    					+"\" src=\"http://7xioyb.com1.z0.glb.clouddn.com/@/product/"
    					+dif.picPath
    					+"?imageView2/1/w/58/h/77\"></a>"

                		if(dif._id != result.differShow._id){
                			
                			str+="<option data-pid=\""
				                	+dif.product_id
				                	+"\" data-did=\""
				                	+dif._id
				                	+"\" data-bid=\""
				                	+result.product.brand_id
				                	+"\" data-pic=\""
				                	+dif.picPath
				                	+"\" data-price=\""
				                	+dif.differPrice	
				                	+"\" data-market=\""
				                	+dif.marketPrice
				                	+"\">"+dif.differName+"</option>"
                		}
                	})
                	$("#fdiffer").append(str)
                	$("#fproduct-other-images").append(pstr)
                	$("#fbiu").attr("href","/product?id="+result.product._id+"&did="+result.differShow._id)
                //	Layout.initImageZoom();
                }




              })
            })