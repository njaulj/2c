var models = require('../models')
var Item = models.Item
var auth = require('../services/auth.js')
var eventproxy = require('eventproxy')
var search = require('../services/search.js')

module.exports = function (router){
	router.get('/',index)
	router.get('/signin',signin)
	router.get('/signup',signup)
	router.get('/item/show/:iid',show)
	router.get('/forgetPassword',forgetPassword)
	router.get('/logout',logout)
	router.get('/search',search.iquery)
	router.post('/search',search.iquery)
}


function index(req,res){
	var ep = new eventproxy()
	ep.all('brands','items',function(brands,items){
		res.render('index',{
			user:req.session.user || null,
			brands:brands,
			items:items
		})
	})

	models.Item.findAll({
		where:{state:1},
		include:[{model:models.Pic,where:{state:1}},models.Brand,models.Group],
		limit:9})
	.then(function(items){
		ep.emit('items',items)
	})


	models.Brand.findAll({limit:8})
		.then(function (brands){
			ep.emit('brands',brands)
		})



}


function signin(req,res){
	res.render('signin')
}


function signup(req,res){
	res.render('signup')	
}

function logout (req,res){
	delete req.session.user
	res.redirect('/')
}

function forgetPassword (req,res){
	res.render('forget')
}

function show(req,res){
	Item.findById(parseInt(req.params.iid),{
		include:[{model:models.Pic,where:{state:1}},models.Brand,models.Group]
	})
	.then(function(item){
		if(item){
				res.render('item',{
				item:item,
				user:req.session.user,
				SKU:req.query.SKU?req.query.SKU:null
				})
	
		}else{
			res.json({msg:'查无此商品'})
		}
	})
}