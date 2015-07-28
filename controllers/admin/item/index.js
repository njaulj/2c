var models = require('../../../models')
var Item = models.Item
var pic = require('../../../services/pic.js')
var _ = require('lodash')
var eventproxy = require('eventproxy')
var moment  = require('moment')
var auth = require('../../../services/auth.js')

module.exports = function (router){
	router.post('/batch',auth.authUser,auth.authAdmin,batch_item)
	router.get('/update',auth.authUser,auth.authAdmin,item_update)
	router.post('/create',auth.authUser,auth.authAdmin,create)
	router.get('/new',auth.authUser,auth.authAdmin,item_create)
	router.post('/batch',auth.authUser,auth.authAdmin,batch_item)
	router.get('/manage',auth.authUser,auth.authAdmin,item_manage)

}


function create (req,res){
	var _item = req.body.item
	_item.saleStart = _.isDate(_item.saleStart)?_item.saleStart:null
	_item.saleEnd = _.isDate(_item.saleEnd)?_item.saleEnd:null
	console.log(_item)
	Item.build(_item).save()
	.then(function(item){
		if(req.body.pid){
		pic.genPic(item,req.body.pid,req.body.sku,req.body.price,req.body.market,req.body.amount,req.body.heavy,function(err,pics){
		//	res.json({status:'success',data:item})
		res.redirect('/admin/item/manage')
		})
	}else{
		res.json({status:'success',msg:'but no pics'})
		}
	})
}

/*功能待商榷
exports.modify = function(req,res){
	var _item = req.body.item
	_item.saleStart = _.isDate(_item.saleStart)?_item.saleStart:null
	_item.saleEnd = _.isDate(_item.saleEnd)?_item.saleEnd:null
	Item.update(_item,{
		where:{id:parseInt(req.params.iid)}
	})
	.then(function(item){
		Item.findById(parseInt(req.params.iid))
		.then(function(item){
			if(req.body.pid){
				pic.genPic(item,req.body.pid,req.body.sku,req.body.price,req.body.market,req.body.amount,req.body.heavy,function(err,pics){
					res.json({status:'success',data:item})
				})
			}else{
				res.json({status:'success',msg:'but no pics'})
			}
		})
		
	})
}
*/


function item_create (req,res){
	res.render('edit',{
		user:req.session.user
	})
}

function item_update (req,res){
	models.Item.findById(parseInt(req.query.id),
	{
		include:[models.Pic,models.Brand,models.Group]
	}).then(function(item){
		res.render('update',{
			user:req.session.user,
			item:item
		})
	})
}


function item_manage (req,res){
	res.render('../admin/itemlist',{
		user:req.session.user
	})
}



function batch_item (req,res){
	var order = [[]]
			var draw = parseInt(req.body.draw)
			var start = req.body.start
			var length = req.body.length
			var _column = req.body.order[0].column
			var _dir = req.body.order[0].dir
		switch(_column){
			case 1:{order[0].push('id')
					break}
			case 2:{order[0].push('name')
					break}
			case 3:{order[0].push('BrandId')
					break}
			case 4:{order[0].push('pv')
					break}
			case 5:{order[0].push('sold')
					break}
			case 6:{order[0].push('inhand')
					break}
			case 7:{order[0].push('saleEnd')
					break}
			case 8:{order[0].push('state')
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
			//	query.UserId = req.session.user.id 
        	var ep = new eventproxy()
        	ep.after('items',ids.length,function(items){
        		item_line(query,order,start,length,draw,function(err,datas){
        			res.json(datas)
        		})
        	})

        	for(var i =0;i<ids.length;i++){
        		(function(i){
        			models.Item.find({
        				where:{id:parseInt(ids[i])}
        			}).then(function(item){
        				item.state = state
        				item.save().then(function(item){
        					ep.emit('items',item)
        				})
        			})


        		})(i)
        	}







		}else{

			if(req.body.action && req.body.action == 'filter'){
				var _query = deep_vali(req.body.query,{},'')	
				var query = deeper_vali(_query,{})
			//	query.UserId = req.session.user.id
				
				item_line(query,order,start,length,draw,function(err,data){
					res.json(data)
				})


			}else{
				var query = {}
			//	query.UserId = req.session.user.id
				item_line(query,order,start,length,draw,function(err,data){
						res.json(data)
				})

			}

		}
}



function item_line(query,order,start,length,draw,next){
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

	models.Item.count({
		where:query
	}).then(function(sum){
		ep.emit('sum',sum)
	})
	models.Item.findAll({
		where:query,
		order:order,
		offset:start,
		limit:length,
		include:[models.Brand]
	}).then(function(items){
		 var statArr=[[{'color':'danger','info':'已删'}],[{'color':'success','info':'上架了...'},{'color':'warning','info':'促销中...'}]
                    ,[{'color':'info','info':'下架了...'}]]
		ep.after('datas',items.length,function(datas){
			ep.emit('datasss',datas)

		})

		for(var i =0;i<items.length;i++){
			(function(i){
					var data =[]
					data.push("<input type=\"checkbox\" name=\"id[]\" value=\""+items[i].id+"\">")
                    data.push(items[i].id)
                    data.push("<a href=\"/item/show/"+items[i].id+"\">"+items[i].name+"</a>")
                    data.push(items[i].Brand.brandName)
                    data.push(items[i].pv)
                    data.push(items[i].sold)
                    data.push(items[i].inhand)
                    data.push(moment(items[i].createdAt).format('YYYY-MM-DD')+'---'+moment(items[i].createdAt).format('YYYY-MM-DD'))
                    data.push("<span class=\"label label-sm label-"+statArr[items[i].state][items[i].istate].color+"\">"+statArr[items[i].state][items[i].istate].info+"<\/span>")
                    data.push("<a href=\"/item/show/"+items[i].id+"\" class=\"btn btn-xs default btn-editable\"><i class=\"fa fa-search\"><\/i> 详情<\/a>")
					ep.emit('datas',data)	
			})(i)
		}

	})
}



function deep_vali(a,b,c){
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

function deeper_vali(a,b){
	_.forEach(a,function(n,key){
		if(n && !_.isEmpty(n)){

			b[key]=n
			
		}
	})
	return b
}
