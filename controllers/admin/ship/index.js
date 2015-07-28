var models = require('../../../models')
var Ship = models.Ship
var eventproxy = require('eventproxy')
var _ = require('lodash')
var auth = require('../../../services/auth.js')

module.exports = function (router){
	router.post('/create',auth.authUser,auth.authAdmin,create)
}

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

function create (req,res){
	var _ship = req.body.ship
	var dids = req.body.dids
	if(typeof(dids)=='object'){
	Ship.build({
		shipno:_ship.shipno,
		shipby:_ship.shipby,
		shipWhere:_ship.shipWhere,
		shipWho:_ship.shipWho,
		shipContact:_ship.shipContact,
		OrderId:parseInt(req.query.id)
		})
	.save()
	.then(function(ship){
		models.Detail.update({ShipId:ship.id,state:3},{
			where:{id:{in:dids}}
		}).then(function(details){
			syncOrder(req.query.id,function(err,order){
				res.redirect('/admin/order/view/'+order.id)
			})
		})
		})
	}else{
		Ship.build({
		shipno:_ship.shipno,
		shipby:_ship.shipby,
		shipWhere:_ship.shipWhere,
		shipWho:_ship.shipWho,
		shipContact:_ship.shipContact,
		OrderId:parseInt(req.query.id)
	})
	.save()
	.then(function(ship){
		models.Detail.update({ShipId:ship.id,state:3},{
			where:{id:dids}
		}).then(function(details){
			syncOrder(req.query.id,function(err,order){
				res.redirect('/admin/order/view/'+order.id)
			})
		})
		})
	}

}
