var models = require('../../models')
var Ship = models.Ship
var eventproxy = require('eventproxy')
var _ = require('lodash')


module.exports = function (router){
	router.post('/list',list)
}



function list (req,res){
	var id = parseInt(req.query.id)
	var draw = parseInt(req.body.draw)

	var ep = new eventproxy()
	//console.log(id)
	Ship.findAll({
		where:{OrderId:id},
		include:[models.Detail]
	}).then(function(ships){
		ep.after('ships',ships.length,function(ships){
		//	console.log(ships)
			var res_data={
                        "data":ships,
                        "draw":draw,
                        "recordsTotal":ships.length,
                        "recordsFiltered":ships.length
                    }
                    res.json(res_data)
		})

		for (var i = 0;i<ships.length;i++){
			(function(i){
				var ship = ships[i]


			var details = ships[i].Details
			ep.after('packages',details.length,function(packages){
				var data=[]
				var company
				data.push("<input class=\"hidden\" type=\"checkbox\" name=\"id[]\" value=\""+ship.id+"\">")
                                            data.push(ship.shipno)
                                     		//console.log(ship.shipby)
                                                switch(ship.shipby){
                                                                case "sf": {company="顺丰";break;}  
                                                                case "sto":{company= "申通";break;}
                                                                case "yt": {company="圆通";break;}
                                                                case "yd": {company="韵达";break;}
                                                                case "tt": {company="天天";break;}
                                                                case "ems":{company= "EMS";break;}
                                                                case "zto":{company= "中通";break;}
                                                                case "ht": {company="汇通";break;}
                                                                case "qf": {company="全峰";break;}
                                                            }
                                         //   console.log(company)
                                            data.push(company)
                                            data.push(ship.shipWhere+'-'+ship.shipWho+'-'+ship.shipContact)
                                     		data.push(packages)
                                 			data.push("<a href=\"/ship/query?id="+ship.id+"\" class=\"btn btn-xs default btn-editable\"><i class=\"fa fa-th-list\"><\/i> Detail<\/a>")
                                   			 ep.emit('ships',data) 
			})

			for(var j =0;j<details.length;j++){
				(function(j){
				models.Detail.findById(details[j].id,
					{include:[models.Item,models.Pic]})
				.then(function(deta){
					var str = ''
					str = "<a href=\"/item/show/"+deta.Item.id+"?SKU="+deta.PicId+"\">"+deta.Item.name+'[ '+deta.Pic.picSku+' ] x '+deta.amount+"</a>"
					ep.emit('packages',str)
				})
			})(j)
			}
			})(i)
		}

	})

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