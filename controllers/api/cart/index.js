var models = require('../../../models')
var Cart = models.Cart
var _ = require('lodash')
var eventproxy = require('eventproxy')


function list (req,res){
	Cart.findById(parseInt(req.params.cid))
	.then(function(cart){
		cart.state = 0
		cart.save().then(function(){
			Cart.findAll({
				where:{
					UserId:req.session.user.id,
					BrandId:cart.BrandId,
					state:1
				}
			}).then(function(xcart){
				Cart.findAll({
					where:{
						UserId:req.session.user.id,
						state:1
					}
				}).then(function(ycart){
					if (xcart.length > 0) {
                            res.json({success: 1,cart1:xcart.length,cart2:ycart.length})
                       
                    }
                    else {
                         if(ycart.length>0){
                            res.json({success: 1,cart1:0,cart2:ycart.length,})
                        }else{
                            res.json({success: 1,cart1:0,cart2:0})
                        }

                    }
				})
			})
		})

	})
}