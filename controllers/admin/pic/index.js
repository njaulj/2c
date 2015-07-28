var models = require('../../../models')
var Pic = models.Pic
var uploader = require('../../../services/uploader.js')
var fs = require('fs')
var qiniuConfig = require('../../../config/some.json')
var _ = require('lodash')
var eventproxy = require('eventproxy')
var auth = require('../../../services/auth.js')


module.exports = function (router){
	router.post('/upload',auth.authUser,auth.authAdmin,upload)
	router.post('/desp',auth.authUser,auth.authAdmin,desp)
	router.post('/meta',auth.authUser,auth.authAdmin,meta)
	router.delete('/delete',auth.authUser,auth.authAdmin,del)
}

function upload (req,res){
	var picpath = req.files.file.path

	var extension = '.'+picpath.split('.')[1]


	Pic
	.build({
		picPath:picpath,
		picExt:extension
	})
	.save()
	.then(function(pic){
		uploader.uploadFile(picpath,'item/'+pic.id+extension,function(err,result){
			pic.cloudPath = '/item/'+pic.id+extension
			pic.save().then(function(pic){
				res.json({result:'OK',filePath:qiniuConfig.qiniu+pic.cloudPath,pic:pic})
			})
		})
	})
		//uploader.uploadFile(picpath,'/item/'+picpath.)
}


function meta (req,res){
	var picpath = req.files.file.path

	var extension = '.'+picpath.split('.')[1]


	Pic
	.build({
		picPath:picpath,
		picExt:extension
	})
	.save()
	.then(function(pic){
		uploader.uploadFile(picpath,'meta/'+pic.id+extension,function(err,result){
			pic.cloudPath = '/meta/'+pic.id+extension
			pic.save().then(function(pic){
			res.json({url:qiniuConfig.qiniu+pic.cloudPath})
			})
		})
	})
}


function desp (req,res){
	var picpath = req.files.file.path

	var extension = '.'+picpath.split('.')[1]


	Pic
	.build({
		picPath:picpath,
		picExt:extension
	})
	.save()
	.then(function(pic){
		uploader.uploadFile(picpath,'desp/'+pic.id+extension,function(err,result){
			pic.cloudPath = '/desp/'+pic.id+extension
			pic.save().then(function(pic){
			res.json({url:qiniuConfig.qiniu+pic.cloudPath})
		})
		})
	})
}

function del (req,res){
	Pic.findById(parseInt(req.query.id))
	.then(function(pic){
		pic.state = 0
		pic.save().then(function(pic){
			res.json(pic)
		})
	})
}


function genPic (item,pidArr,skuArr,priceArr,marketArr,amountArr,heavyArr,next){
	if(_.isArray(pidArr)){
		var ep = new eventproxy()
		ep.after('pics',pidArr.length,function(pics){
			next(null,pics)
		})

		for(var i=0;i<pidArr.length;i++){
			(function(i){
			Pic.findById(parseInt(pidArr[i]))
			.then(function(pic){
				pic.picMeta = item.name
				pic.picSku = skuArr[i]?skuArr[i]:0
				pic.picPrice = priceArr[i]?priceArr[i]:0
				pic.picMarket = marketArr[i]?marketArr[i]:0
				pic.amount = amountArr[i]?amountArr[i]:0
				pic.heavy = heavyArr[i]?heavyArr[i]:0
				pic.save().then(function(pic){
					pic.setItem(item).then(function(){
					ep.emit('pics',pic)
					})
				})
			})
		})(i)
		}
	}else{
		Pic.findById(parseInt(pidArr))
			.then(function(pic){
				pic.picMeta = item.itemName
				pic.picSku = skuArr
				pic.picPrice = priceArr
				pic.picMarket = marketArr
				pic.amount = amountArr
				pic.heavy = heavyArr
				pic.save().then(function(pic){
					pic.setItem(item).then(function(){
						next(null,pic)
					})
				})
			})
	}
}


exports.genPic = genPic