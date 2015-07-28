var models = require('../models')
var Warehouse = models.Warehouse
var yuntu = require('../config/some.json')['yuntu']
var request = require('request')
var querystring = require('querystring')



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