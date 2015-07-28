var models = require('../../../models')
var Address = models.Address
var yuntu = require('../../../config/some.json')['yuntu']
var request = require('request')
var querystring = require('querystring')
var auth = require('../../../services/auth.js')

module.exports = function (router){
	router.post('/create',auth.authUser,create)

}


function create (req,res){

	console.log(req.body)

	var address = {
		_name:req.body.where,
		_location:req.body.longitude+','+req.body.latitude,
		type:2,
		contact:req.body.contact,
		city:req.body.city
	}

	var yunturecord = JSON.stringify(address)

	var data= {
		key:yuntu.key,
		tableid:yuntu.tableid,
		data:yunturecord
	}

	request.post({url:'http://yuntuapi.amap.com/datamanage/data/create',form:data},function(err,resp,body){

		var body = JSON.parse(body)
		if(body.status == 1){

			Address.create({
			addressWhere:req.body.where,
			addressWho:req.body.who,
			addressContact:req.body.contact,
			longitude:req.body.longitude,
			latitude:req.body.latitude,
			city:req.body.city,
			yuntuid:parseInt(body._id),
			UserId:req.session.user.id
				}).then(function(address){
						res.json(address)
				})
			
		}
		else{
			res.json(body)
		}
	})
}

