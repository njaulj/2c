var Ecart=function(){

	
	var initCart=function(){	

		$.ajax({
			url:"/user/cart/tips?isajax=1",
			type:"post",
			headers:{
				'x-csrf-token':$("#csrf").val()
			},
			success:function(data){
				if(data.status=='error'){
					$("#signin").trigger('ajax')

				}else{
					if(data.carts.length >0){
				$(".top-cart-info-count").html(data.carts.length+ '&nbsp;商品')
			//	$(".top-cart-info-value").html((data.total/100).toFixed(2))
				$(".top-cart-content-wrapper .top-cart-content .scroller").empty()

				
							var sum = 0
						data.carts.forEach(function(cart,index){
							var str="<li id=\""+cart.id+"\">"
			                  +"<a href=\"/product?id="+cart.ItemId+"\"><img src=\"http://7xkj70.com1.z0.glb.clouddn.com"+cart.Pic.cloudPath+"?imageView2/1/w/37/h/34/interlace/1\" alt=\"Rolex Classic Watch\" width=\"37\" height=\"34\"></a>"
			                  +"<span class=\"cart-content-count\">x"+cart.amount+"</span>"
			                  +"<strong><a href=\"/item/show/"+cart.ItemId+"?SKU="+cart.PicId+"\">"+cart.Pic.picSku+"</a></strong>"
			                  +"<em>¥"+(cart.Pic.picPrice*cart.amount).toFixed(2)+"</em>"
			                  +"<a data-cid=\""+cart.id+"\" class=\"del-goods\"></a>"
			                  +"</li>"
			                 $(".top-cart-content-wrapper .top-cart-content .scroller").append(str)
			                 $("#carttip").text("查看购物车")
			                 $("#carttip").prev().attr("href","/cart")

			                 sum+=cart.Pic.picPrice*cart.amount
			                	

						})
						$(".top-cart-info-value").html(parseFloat(sum).toFixed(2))
						v()
					
				}else{
					$(".top-cart-content-wrapper .top-cart-content .scroller").append("<li>购物车空空如也，还不赶快去补货</li>")
					$("#carttip").prev().attr("href","/")
					$("#carttip").text("赶紧购物")


				}
			}
		}

			
		})

		


	}


	return {
		init:function(){
			initCart()
		}
	};


}();