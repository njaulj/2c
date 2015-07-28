
var models = require('../models')
var Ship = models.Ship
var eventproxy = require('eventproxy')
var _ = require('lodash')

function syncOrder(id,next){
	models.Order.find({
		where:{id:id},
		include:[models.Detail]
	}).then(function(order){
		if(order.Details.length ==1 ){
			order.state = order.Details.state
			order.save().then(function(order){
				next(null,order)
			})
		}else{
			var s=[]
			order.Details.forEach(function(detail){
				s.push(detail.state)
			})
			var ss=_.uniq(s)
			console.log(ss)
			if(ss.length==1){
				order.state = ss[0]
				order.save().then(function(order){
				next(null,order)
				})
			}else{
				next(null,order)
			}
		}
	})
}

function rudeSync(id,next){
	models.Order.find({
		where:{id:id}
	}).then(function(order){
		models.Detail.update({state:order.state},{
			where:{OrderId:id}
		}).then(function(affectRows){
			next(null,order)
		})
	})
}

exports.syncOrder = syncOrder
exports.rudeSync = rudeSync