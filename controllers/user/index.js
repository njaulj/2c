var models = require('../../models')
var User = models.User
var bcrypt = require('bcrypt')
var crypto = require('crypto')
var eventproxy = require('eventproxy')
var moment = require('moment')
var _ = require('lodash')
var auth = require('../../services/auth.js')

//router

module.exports = function (router){
	router.get('/index',auth.authUser,index)
	router.post('/create',create)
	router.post('/signin',signin)
	router.post('/logout',auth.authUser,logout)
}

function index (req,res){

	var ep = new eventproxy()
	ep.all('carts','checks','favors','orders',function(carts,checks,favors,orders){
		res.render('myzone',{
			carts:carts,
			user:req.session.user,
			orders:orders,
			checks:checks,
			favors:favors
		})
	})


	//我的购物车
	models.Cart.findAll({
		where:{UserId:req.session.user.id,
				state:1},
		include:[models.Pic,models.Item],
		order:[['updatedAt','desc']],
		limit:7
	}).then(function(carts){
		ep.emit('carts',carts)
	})

	//我的checklist
	models.Cart.findAll({
		where:{UserId:req.session.user.id,
				state:2},
		include:[models.Pic,models.Item],
		order:[['updatedAt','desc']],
		limit:7
	}).then(function(checks){
		ep.emit('checks',checks)
	})

	//最近购买的单品
	models.Cart.findAll({
		where:{UserId:req.session.user.id,
				state:3},
		include:[models.Pic,models.Item],
		order:[['updatedAt','desc']],
		limit:7
	}).then(function(favors){
		ep.emit('favors',favors)
	})


//最近的订单 待付款订单
	models.Order.findAll({
		where:{UserId:req.session.user.id},
		order:[['updatedAt','desc']],
		limit:7
	}).then(function(orders){
		ep.emit('orders',orders)
	})


}


//direct op

function create (req,res){
	var _user = req.body.user
	var md5=crypto.createHash('md5');
	var password=md5.update(_user.password).digest('hex');
			_user.password = password
			User
				.build(_user)
				.save()
				.then(function(user){
						req.session.user = user
						res.redirect('/')
					})
	
}

function signin (req,res){
	User.find({
		where:{username:req.body.username}
	}).then(function(user){
		if(user){
			var md5=crypto.createHash('md5');
			var _password=md5.update(req.body.password).digest('hex');
			console.log(_password)
		//	console.log(user)
			if(_password == user.password){
				req.session.user = user
				res.redirect('/')
			}
			else{
				res.redirect('/signin')
			}

		}else{
				res.redirect('/signin')
			}
	})
}

function logout (req,res){
	delete req.session.user
	res.redirect('/')
}


/*md5 

function genSalt(password,next){
	 var md5=crypto.createHash('md5');
	 var password=md5.update(password).digest('hex');
	 next(null,password)
}


function comparePass(_password,password,next){
	var md5=crypto.createHash('md5');
	 var _password=md5.update(_password).digest('hex');
	 if(_password == password){
	 	next(null,true)
	 }
	 else{
	 	next(null,false)
	 }

}

*/


function genSalt(password,next){
	 bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) return next(err)
            next(null,hash)
        })
    })
}





function comparePass(_password,password,next){
	bcrypt.compare(_password, password, function(err, isMatch) {
            if (err) return next(err,null)
            	console.log(isMatch)
            next(null, isMatch)
        })
}



//service op for other module

function summarize (order,uid,next){
	User.findById(parseInt(uid))
	.then(function(user){
		user.orders++
		user.total += order.total
		user.save().then(function(user){
			next(null,user)
		})
	})
}

exports.summarize = summarize 
