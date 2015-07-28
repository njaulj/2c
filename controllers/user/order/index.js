var models = require('../../../models')
var Order = models.Order
var eventproxy = require('eventproxy')
var _ = require('lodash')
var detail = require('../../../services/detail.js')
var moment = require('moment')
var warehouse = require('../../../services/warehouse.js')
var auth = require('../../../services/auth.js')

module.exports = function (router){
	router.post('/create',create)
	router.get('/latest',auth.authUser,order_latest)
	router.get('/view/:oid',auth.authUser,order_detail)
	router.get('/list',auth.authUser,order_list)
	router.post('/batch',auth.authUser,batch_order)

}



function create (req,res){
	var aid = req.body.address
	var cArr = req.body.sure
	if(cArr){

	models.Address.findById(parseInt(aid))
	.then(function(address){
		Order.create({
			orderWhere:address.addressWhere,
			orderWho:address.addressWho,
			orderContact:address.addressContact,
			longitude:address.longitude,
			latitude:address.latitude,
			city:address.city,
			UserId:req.session.user.id
		}).then(function(order){
			detail.genDetail(order,order.UserId,cArr,function(err,total){
				order.total = total
				order.save().then(function(order){
					warehouse.pushOrder(order,function(err,warehouse){	
						if(warehouse && warehouse !=undefined){
						order.WarehouseId = warehouse.id
						order.save().then(function(){
							res.redirect('/user/order/list')
						})
						}else{
							res.redirect('/user/order/list')
						}
					})
				})
			})
		})
	})
	}else{
		res.redirect('/')
	}
}


function order_latest (req,res){
	models.Order.findAll({
		where:{UserId:req.session.user.id,
				state:1},
    order:[['createdAt','desc']],
	limit:10
	}).then(function(orders){
		if(orders.length>0){
			var ep = new eventproxy()
			ep.after('datas',orders.length,function(datas){
				res.json(datas)
			})

			for(var i=0;i<orders.length;i++){
				(function(i){
					var data =[]
					data.push(orders[i].id)
					data.push(orders[i].total)
					ep.emit('datas',data)
				})(i)
			}

		}else{
			res.json([[moment(Date.now()).format('DD/MM/YYYY'),0]])
		}
	})
}

function order_list (req,res){
	res.render('orderlist',{
		user:req.session.user
	})
}

function order_detail (req,res){
	var ep = new eventproxy()

	ep.all('order','details',function(order,details){
		res.render('order',{
			user:req.session.user,
			order:order,
			details:details
		})
	})

	models.Detail.findAll({
		where:{OrderId:parseInt(req.params.oid),
		UserId:req.session.user.id},
		include:[models.Pic,models.Item]
	}).then(function(details){
		ep.emit('details',details)
	})

	models.Order.find({
		where:{id:parseInt(req.params.oid),
				UserId:req.session.user.id}
	})
	.then(function(order){
			ep.emit('order',order)
	})
}


function batch_order (req,res){
		var order = [[]]
			var draw = parseInt(req.body.draw)
			var start = req.body.start
			var length = req.body.length
			var _column = req.body.order[0].column
			var _dir = req.body.order[0].dir
		switch(_column){
			case 1:{order[0].push('id')
					break}
			case 2:{order[0].push('orderWho')
					break}
			case 3:{order[0].push('orderWhere')
					break}
			case 4:{order[0].push('total')
					break}
			case 5:{order[0].push('createdAt')
					break}
			case 6:{order[0].push('updatedAt')
					break}
			case 7:{order[0].push('state')
					break}
			default:{
					order[0].push('id')
					break
			}

		}
			order[0].push(_dir)
			console.log(order)


		if(req.body.customActionType) {
			var customActionType=req.body.customActionType
        	var customActionName=req.body.customActionName
        	var ids = req.body.id
        //	console.log(ids)
        //	console.log(typeof(ids))
        	var state = parseInt(customActionName)
        	var query = {}
				query.UserId = req.session.user.id 
        	var ep = new eventproxy()
        	ep.after('orders',ids.length,function(orders){
        		order_line(query,order,start,length,draw,function(err,datas){
        			res.json(datas)
        		})
        	})

        	for(var i =0;i<ids.length;i++){
        		(function(i){
        			models.Order.find({
        				where:{UserId:req.session.user.id,
        					   id:parseInt(ids[i])}
        			}).then(function(order){
        				order.state = state
        				order.save().then(function(order){
        					ep.emit('orders',order)
        				})
        			})


        		})(i)
        	}







		}else{

			if(req.body.action && req.body.action == 'filter'){
				var _query = deep_vali(req.body.query,{},'')	
				var query = deeper_vali(_query,{})
				query.UserId = req.session.user.id
				
				order_line(query,order,start,length,draw,function(err,data){
					res.json(data)
				})


			}else{
				var query = {}
				query.UserId = req.session.user.id
				order_line(query,order,start,length,draw,function(err,data){
						res.json(data)
				})

			}

		}
}



function order_line( query,order,start,length,draw,next){
	var ep = new eventproxy()


	ep.all('datasss','sum',function(datasss,sum){
		var res_data = {
				"data":datasss,
				"draw":draw,
				"recordsTotal":sum,
				"recordsFiltered":sum
			}
			next(null,res_data)
	})

	models.Order.count({
		where:query
	}).then(function(sum){
		ep.emit('sum',sum)
	})

	models.Order.findAll({
		where:query,
		order:order,
		offset:start,
		limit:length
	}).then(function(orders){
		 var statArr=[{'color':'danger','info':'已抛'},
					 {'color':'warning','info':'忘记给钱了...'},
					 {'color':'info','info':'等待发货...'},
					 {'color':'info','info':'等待收货...'},
					 {'color':'success','info':'搞定，败家成功'}]

		ep.after('datas',orders.length,function(datas){
			ep.emit('datasss',datas)

		})

		for(var i =0;i<orders.length;i++){
			(function(i){
					var data =[]
					data.push("<input type=\"checkbox\" name=\"id[]\" value=\""+orders[i].id+"\">")
                    data.push("<a href=\"/user/order/view/"+orders[i].id+"\">"+orders[i].id+"</a>")
                    data.push(orders[i].orderWho)
                    data.push(orders[i].orderWhere)
                    data.push(orders[i].total)
                    data.push(moment(orders[i].createdAt).format('YYYY-MM-DD'))
                    data.push(moment(orders[i].createdAt).format('YYYY-MM-DD'))
                    data.push("<span class=\"label label-sm label-"+statArr[orders[i].state].color+"\">"+statArr[orders[i].state].info+"<\/span>")
                    data.push("<a href=\"/user/order/view/"+orders[i].id+"\" class=\"btn btn-xs default btn-editable\"><i class=\"fa fa-search\"><\/i> 详情<\/a>")
					ep.emit('datas',data)	
			})(i)
		}

	})
}


function deep_vali (a,b,c){
	_.forEach(a,function(n,key){
		if(n){
			if(_.isObject(n)){
				b[key]={}
				deep_vali(n,b,key)
			}else{
				if(c){
					b[c][key]=n
				}else{
					b[key] =n
				}
			}
		}
	})
	return b
}

function deeper_vali (a,b){
	_.forEach(a,function(n,key){
		if(n && !_.isEmpty(n)){

			b[key]=n
			
		}
	})
	return b
}