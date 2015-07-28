var models = require('../../../models')
var Brand = models.Brand
var uploader = require('../../../services/uploader.js')
var fs = require('fs')
var qiniuConfig = require('../../../config/some.json')
var auth = require('../../../services/auth.js')


module.exports = function (router){
	router.get('/manage',auth.authUser,auth.authAdmin,manage) //重新设计一个界面
	router.get('/view/:bid',auth.authUser,auth.authAdmin,show)
	router.post('/create',auth.authUser,auth.authAdmin,create)
	router.post('/modify',auth.authUser,auth.authAdmin,modify)
}


function manage (req,res){
	Brand.findAll()
	.then(function(brands){

		res.render('brandpic',{
			user:req.session.user,
			brands:brands
		})
	})
}

function show (req,res){
	Brand.findById(parseInt(req.params.bid))
	.then(function(brand){
		res.json(brand)
	})

}



function create (req,res){
	var picpath = req.files.file.path

	var extension = '.'+picpath.split('.')[1]


	Brand
	.build({
		brandName:req.body.brandName
	})
	.save()
	.then(function(brand){
		uploader.uploadFile(picpath,'brand/'+brand.id+extension,function(err,result){
			brand.brandPic = '/brand/'+brand.id+extension
			brand.save().then(function(brand){
			//res.json({url:qiniuConfig.qiniu+brand.brandPic})
			res.redirect('/admin/brand/manage')
		})
		})
	})
}


function modify (req,res){
	var picpath = req.files.file.path

	var extension = '.'+picpath.split('.')[1]


	Brand.findById(parseInt(req.body.id))
	.then(function(brand){
		uploader.deleteFile(brand.brandPic.slice(1),function(err,resl){
			uploader.uploadFile(picpath,'brand/'+brand.id+extension,function(err,result){
				brand.brandPic = '/brand/'+brand.id+extension
				brand.save().then(function(brand){
				res.json({url:qiniuConfig.qiniu+brand.brandPic})
			})

		})
	})
	})
}