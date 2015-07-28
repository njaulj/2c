var models = require('../../../models')
var Cart = models.Cart
var _ = require('lodash')
var eventproxy = require('eventproxy')
var auth = require('../../../services/auth.js')
var moment = require('moment')


module.exports = function (router){
	router.post('/add/:bid/:iid/:pid/:amount',auth.authUser,create)
	router.post('/tips',auth.authUser,tips)
	router.post('/delete/:cid',auth.authUser,del)
	router.get('/list',auth.authUser,list)
	router.get('/add/:cid/:num',auth.authUser,add)
	router.get('/minus/:cid/:num',auth.authUser,minus)
	router.get('/set/:cid/:num',auth.authUser,set)
	router.post('/check',auth.authUser,check)
	router.get('/checklist',auth.authUser,checklist)
	router.get('/latest',auth.authUser,carts_latest)

}





function create (req,res){
	Cart.find({
		where:{UserId:req.session.user.id,
				PicId:parseInt(req.params.pid),
				state:1}
	})
	.then(function(cart){
		if(cart){
			cart.amount = parseInt(req.params.amount)
			cart.save().then(function(cart){
				res.json({status:'success',msg:'good'})
			})
		}
		else{
				Cart
				.create({
					UserId:req.session.user.id,
					ItemId:parseInt(req.params.iid),
					PicId:parseInt(req.params.pid),
					BrandId:parseInt(req.params.bid),
					amount:parseInt(req.params.amount)
				})
				.then(function(cart){
					res.json({status:'success',msg:'good'})
				})
		}
	})

}


function tips (req,res){
	Cart
	.findAll(
	{
		where:{UserId:req.session.user.id,state:1},
		include:[models.Pic,models.Item]

	})
	.then(function(carts){
		res.json({carts:carts})
	})
}


function list (req,res){
	Cart
	.findAll({
		where:{UserId:req.session.user.id,state:1},
		include:[models.Pic,models.Item,models.Brand]
	})
	.then(function(carts){
		res.render('mycart',{
			user:req.session.user,
			carts:carts,
			xbrands:_.uniq(_.pluck(carts,'Brand'),'id')
		})
	})
}


function del (req,res){
	Cart.findById(parseInt(req.params.cid))
	.then(function(cart){
		cart.state = 0
		cart.save().then(function(){
			Cart.findAll({
				where:{
					UserId:req.session.user.id,
					BrandId:cart.BrandId,
					state:1
				}
			}).then(function(xcart){
				Cart.findAll({
					where:{
						UserId:req.session.user.id,
						state:1
					}
				}).then(function(ycart){
					if (xcart.length > 0) {
                            res.json({success: 1,cart1:xcart.length,cart2:ycart.length})
                       
                    }
                    else {
                         if(ycart.length>0){
                            res.json({success: 1,cart1:0,cart2:ycart.length,})
                        }else{
                            res.json({success: 1,cart1:0,cart2:0})
                        }

                    }
				})
			})
		})

	})
}


function add (req,res){
	var cid = parseInt(req.params.cid)
	var num = parseInt(req.params.num)

	Cart.findById(cid,{
		include:[models.Pic]
	})
	.then(function(cart){
		if((cart.amount+num)<1000){
			cart.amount = cart.amount+num
		cart.save().then(function(cart){
			res.json(cart)
		})
		}else{
			cart.amount = 999
			cart.save().then(function(cart){
			res.json(cart)
		})
		}
	})
}

function minus (req,res){
	var cid = parseInt(req.params.cid)
	var num = parseInt(req.params.num)

	Cart.findById(cid,{
		include:[models.Pic]
	})
	.then(function(cart){
		if((cart.amount-num)>1){
			cart.amount = cart.amount-num
		cart.save().then(function(cart){
			res.json(cart)
		})
		}else{
			cart.amount = 1
			cart.save().then(function(cart){
			res.json(cart)
		})
		}
	})

}


function set (req,res){
	var cid = parseInt(req.params.cid)
	var num = parseInt(req.params.num)

	Cart.findById(cid,{
		include:[models.Pic]
	})
	.then(function(cart){
		cart.amount = num
		cart.save().then(function(cart){
			res.json(cart)
		})
	})
}


function check (req,res){
	var cArr = req.body.sure
	if(cArr){
		if(typeof(cArr)==='object'){
			var ep = new eventproxy()
			ep.after('checks',cArr.length,function(checks){
				res.redirect('/user/cart/checklist')
			})

			for (var i =0;i<cArr.length;i++){
				(function(i){
				Cart.findById(parseInt(cArr[i]))
				.then(function(cart){
					cart.state = 2
					cart.save().then(function(cart){
						ep.emit('checks',cart)
					})
				})
			})(i)
			}

		}else{
			Cart.findById(parseInt(cArr))
				.then(function(cart){
					cart.state = 2
					cart.save().then(function(cart){
					 res.redirect('/user/cart/checklist')
				})
				})

		}
	}else{
		res.redirect('/user/cart/list')
	}
}



function checklist (req,res){

	var ep = new eventproxy()

	ep.all('addresses','carts',function(addresses,carts){
			res.render('checklist',{
			user:req.session.user,
			addresses:addresses,
			carts:carts,
			xbrands:_.uniq(_.pluck(carts,'Brand'),'id'),
			total:_.sum(carts,function(cart){return cart.Pic.picPrice*cart.amount})
		})
	})

	models.Address.findAll({
		where:{UserId:req.session.user.id}
	}).then(function(addresses){
		ep.emit('addresses',addresses)
	})


	Cart
	.findAll({
		where:{UserId:req.session.user.id,state:2},
		include:[models.Pic,models.Item,models.Brand]
	})
	.then(function(carts){
		ep.emit('carts',carts)
	})
}



function carts_latest (req,res){
	models.Cart.findAll({
		where:{UserId:req.session.user.id,
				state:{$gt:0}},
		order:[['updatedAt','desc']],
		limit:10,
		include:[models.Pic]
	}).then(function(carts){
		if(carts.length>0){
			var ep = new eventproxy()
			ep.after('datas',carts.length,function(datas){
				res.json(datas)
			})

			for(var i=0;i<carts.length;i++){
				(function(i){
					var data =[]
					data.push(carts[i].id)
					data.push(carts[i].Pic.picPrice*carts[i].amount)
					ep.emit('datas',data)
				})(i)
			}

		}else{
			res.json([[moment(Date.now()).format('DD/MM/YYYY'),0]])
		}
	})
}