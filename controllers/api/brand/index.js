var models = require('../../../models')
var Brand = models.Brand

module.exports = function (router){
	router.get('/list',list)
}


function list (req,res){
	Brand.findAll()
	.then(function(brands){
		res.json({data:brands})
	})
}