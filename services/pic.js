var models = require('../models')
var Pic = models.Pic
var uploader = require('./uploader.js')
var fs = require('fs')
var qiniuConfig = require('../config/some.json')
var _ = require('lodash')
var eventproxy = require('eventproxy')

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