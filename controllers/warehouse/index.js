var models = require('../../models')
var Warehouse = models.Warehouse
var yuntu = require('../../config/some.json')['yuntu']
var request = require('request')
var querystring = require('querystring')

module.exports = function (router){
	router.get('/map',map)
	router.post('/create',create)
}


function map (req,res){
	res.render('warehouse',{
		user:req.session.user
	})
}


function create (req,res){

	var warehouse = {
		_name:req.body.warehouse.name,
		_location:req.body.warehouse.longitude+','+req.body.warehouse.latitude,
		type:1,
		contact:req.body.warehouse.contact,
		city:req.body.warehouse.city
	}

	var yunturecord = JSON.stringify(warehouse)

	var data= {
		key:yuntu.key,
		tableid:yuntu.tableid,
		data:yunturecord
	}

	request.post({url:'http://yuntuapi.amap.com/datamanage/data/create',form:data},function(err,resp,body){

		var body = JSON.parse(body)
		if(body.status == 1){
			Warehouse.create({
				longitude:req.body.warehouse.longitude,
				latitude:req.body.warehouse.latitude,
				name:req.body.warehouse.name,
				contact:req.body.warehouse.contact,
				yuntuid:parseInt(body._id),
				city:req.body.warehouse.city,
				UserId:req.session.user.id
			}).then(function(warehouse){
				res.json({status:'1',info:'OK',data:warehouse})
			})
		}
		else{
			res.json(body)
		}
	})
}



function pushOrder (order,next){
	var data = {
		key:yuntu.key,
		tableid:yuntu.tableid,
		center:order.longitude+','+order.latitude,
		radius:20000,
		filter:'city:'+order.city+'+type:'+'1',
		sortrule:'_distance',
		limit:'1'
	}

	var search = querystring.stringify(data)



	request(yuntu.aroundsearch+search,function(err,resp,body){

		var body = JSON.parse(body)
		
		var yuntuid = body.datas[0]._id

		Warehouse.find({
			where:{yuntuid:yuntuid}
		}).then(function(warehouse){
			next(null,warehouse)
		})



	})
}


exports.pushOrder = pushOrder