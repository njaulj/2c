$(function(){
  $(".del-goods").click(function(){
            var cid = $(this).data("cid")
            var bid= $(this).data("bid")
            var holder = $(this)
            $.ajax({
                type:'post',
                url:'/user/cart/del/'+cid+'/1',
                headers:{
                  'x-csrf-token':$("#csrf").val()
                },
                success:function(result){

                   // console.log(nowtotal)
                    if(result.success==1){

                        if(holder.parent().prev().prev().prev().prev().prev().prev().find(".sure").prop("checked")){
                            var subtotal = holder.parent().prev().find(".differTotal").text()*100
                          //  console.log('subtotal'+subtotal)
                            var evertotal = $("#total").text()*100
                            var nowtotal=((evertotal-subtotal)/100).toFixed(2)
                            $("#total").text(nowtotal)

                        }
                        if(!result.cart1){
                            var x="#"+bid
                   //     console.log(x)
                        $(x).remove()
                        }
                        
                        var everno = parseInt($("#cartno").text(),10)
                        //    console.log(everno)
                        if(everno >0){
                            var nowno = parseInt(everno-1,10)
                            $("#cartno").text(nowno)
                        }
                        holder.parent().parent().remove()
                        if(!result.cart2){
                                          $("#checkout").attr("disabled",true)

                        }

                    }
                    
                }
            })
        })
	 $(".sure").click(function(){
           // $("#checkout").remove(attr("disabled",disabled))
         //   if($(this).attr("checked")=="checked"){
                // $("checkout").remove(attr("disabled"))
             //   alert($(this).data('did'))
            var subtotal = $(this).parent().parent().parent().next().next().next().next().next().find(".differTotal").text()*100
            var evertotal = $("#total").text()*100
            if($(this).prop("checked")){
                var nowtotal=((evertotal+subtotal)/100).toFixed(2)
                $("#total").text(nowtotal)
              //  console.log(nowtotal)
              //  console.log($("#total").text())

            }else{
                var xnowtotal=((evertotal-subtotal)/100).toFixed(2)
                $("#total").text(xnowtotal)
             //   console.log(xnowtotal)
              //  console.log($("#total").text())

            }
            if($("input:checkbox:checked").length>0){
                $("#checkout").removeAttr("disabled")
              //  $("input:checkbox:checked").each(function(){


            }
            else{
                $("#checkout").attr("disabled",true)
            }
        //    }
        })

         $(".sure").bind('lsl',function(event){
             var sum=0
              $('.sure').each(function(){
                if($(this).prop("checked")){
                  
                 sum+=$(this).parent().parent().parent().next().next().next().next().next().find(".differTotal").text()*100
                //   console.log($(this).parent().parent().parent().next().next().next().next().next().find(".differTotal").text())

                   
                  //  console.log('1')
                }
                sum+=0
              //  console.log('2')
              })
             // console.log(sum)
             $("#total").text((sum/100).toFixed(2))

         })
})