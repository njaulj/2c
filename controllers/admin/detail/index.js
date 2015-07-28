var models = require('../../../models')
var Detail = models.Detail
var eventproxy = require('eventproxy')
var _ = require('lodash')
var auth = require('../../../services/auth.js')

function genDetail (order,uid,cArr,next){
	if(typeof(cArr)==='object'){
		var ep = new eventproxy()
		ep.after('details',cArr.length,function(details){
			var total = _.sum(details,function(detail){return detail.subtotal})
			next(null,total)
		})

		for(var i =0;i<cArr.length;i++){
			(function(i){	
				models.Cart.findById(cArr[i],{
					include:[models.Pic]
				})
				.then(function(cart){
					var subtotal = cart.Pic.picPrice*cart.amount
					Detail.create({
						OrderId:order.id,
						UserId:uid,
						BrandId:cart.BrandId,
						PicId:cart.PicId,
						ItemId:cart.ItemId,
						price:cart.Pic.picPrice,
						amount:cart.amount,
						market:cart.Pic.picMarket,
						subtotal:subtotal
					}).then(function(detail){
						cart.state =3
						cart.save().then(function(){
						ep.emit('details',detail)
						})
					})
				})
			})(i)
		}

	}else{
		models.Cart.findById(cArr,{
					include:[models.Pic]
				})
		.then(function(cart){
			var subtotal = cart.Pic.picPrice*cart.amount
			Detail.create({
						OrderId:order.id,
						UserId:uid,
						BrandId:cart.BrandId,
						PicId:cart.PicId,
						ItemId:cart.ItemId,
						price:cart.Pic.picPrice,
						amount:cart.amount,
						market:cart.Pic.picMarket,
						subtotal:subtotal
					}).then(function(detail){
						cart.state = 3
						cart.save().then(function(){

						next(null,detail.subtotal)
						})
					})
		})

	}
}


exports.genDetail = genDetail