var models = require('../models')
var _ = require('lodash')
var eventproxy = require('eventproxy')


function iquery (req,res){

	var words = req.query.words || req.body.words || null
	var brand = req.query.brand || null
	console.log(brand)
	var group = req.query.group || null
	console.log(group)
//	var _words = _.words(words)
	var limit = req.query.limit || 9
	var page = req.query.page || 1
	var sort = req.query.sort || 'id'
	var order = req.query.order || 'asc'

//	console.log(_words)

	var ep = new eventproxy()

	ep.all('items','bis','gis',function(items,bis,gis){

		var results = _.union(items,bis,gis)
		res.render('search',{
			results:results,
			words:words || brand || group,
			page:page,
			limit:limit,
			sort:sort,
			order:order,
			sum:results.length
		})
	})

	models.Item
	.findAll({
		where:{
			name:{$like:'%'+words+'%'}
		},
		include:[models.Pic]
	})
	.then(function(items){
		ep.emit('items',items)
	})

		models.Brand.findAll({
		where:{
			brandName:{$like:'%'+brand+'%'}
		},
		include:[models.Item]
			}).then(function(brands){
				ep.after('bims',brands.length,function(bims){
					var bims = _.flatten(bims)
					console.log(bims)
					ep.emit('bis',bims)
				})

				for(var i = 0;i<brands.length;i++){
					(function(i){
						var brand = brands[i]
						var iids = _.map(brand.Items,'id')
						console.log(iids)

						models.Item.findAll({
							where:{id:{$in:iids}},
							include:[models.Pic]
						}).then(function(ims){
							ep.emit('bims',ims)
						})

					})(i)
				}
		})
		


		models.Group.findAll({
		where:{
			name:{$like:'%'+group+'%'}
		},
		include:[models.Item]
			}).then(function(groups){
				ep.after('gims',groups.length,function(gims){
					var gims = _.flatten(gims)
					console.log(gims)

					ep.emit('gis',gims)
				})

				for(var j = 0;j<groups.length;j++){
					(function(j){
						var group = groups[j]
						var gids = _.map(group.Items,'id')
						console.log(gids)
						models.Item.findAll({
							where:{id:{$in:gids}},
							include:[models.Pic]
						}).then(function(iims){
							ep.emit('gims',iims)
						})

					})(j)
				}
			})
	

}



exports.iquery = iquery