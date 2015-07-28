var front = require('./controllers/front')
var user = require('./controllers/user')
var admin = require('./controllers/admin')
var item = require('./controllers/item')
var back = require('./controllers/back')
var group = require('./controllers/group')
var pic = require('./controllers/pic')
var brand = require('./controllers/brand')
var cart = require('./controllers/cart')
var address = require('./controllers/address')
var order = require('./controllers/order')
var myzone = require('./controllers/myzone')
var warehouse = require('./controllers/warehouse')
var ship = require('./controllers/ship')

module.exports = function (router){

//frontend op
	router.get('/',front.index)
	router.get('/signup',front.signup)
	router.get('/signin',front.signin)

//user op

	router.post('/user/create',user.create)
	router.post('/user/signin',user.signin)
	router.get('/logout',user.auth,user.logout)

//admin op
	router.post('/api/admin/create/user/:uid',user.auth,admin.create)

//backend op
	
	router.get('/admin/group/manage',user.auth,admin.auth,back.group_manage)
	router.get('/admin/order/manage',user.auth,admin.auth,back.order_manage)
	router.post('/admin/orders/batch',user.auth,admin.auth,back.batch_order)
	router.get('/admin/view/order/:oid',user.auth,admin.auth,back.order_detail)
	router.get('/admin/item/manage',user.auth,admin.auth,back.item_manage)
	router.post('/admin/items/batch',user.auth,admin.auth,back.batch_item)
	router.get('/admin/item/update',user.auth,admin.auth,back.item_update)

//group op
	router.get('/admin/group/show',user.auth,admin.auth,group.show)
	router.post('/admin/group/create',user.auth,admin.auth,group.create)
	router.post('/admin/group/update',user.auth,admin.auth,group.update)
	router.post('/admin/group/delete',user.auth,admin.auth,group.delete)
	router.get('/admin/group/tree',user.auth,admin.auth,group.tree)

//pic op

	router.post('/pic/upload',user.auth,admin.auth,pic.upload)
	router.post('/pic/desp',user.auth,admin.auth,pic.desp)
	router.post('/pic/meta',user.auth,admin.auth,pic.meta)
	router.delete('/admin/pic/delete',user.auth,admin.auth,pic.delete)

//item op

	router.post('/admin/item/create',user.auth,admin.auth,item.create)
	router.get('/item/show/:iid',item.show)
	router.get('/admin/item/new',user.auth,admin.auth,back.item_create)
	//router.post('/admin/item/modify/:iid',user.auth,admin.auth,item.modify)

//brand op
	router.get('/admin/brand/manage',user.auth,admin.auth,brand.manage) //重新设计一个界面
	router.get('/api/brand/:bid',brand.show)
	router.post('/admin/brand/create',user.auth,admin.auth,brand.create)
	router.post('/admin/brand/modify',user.auth,admin.auth,brand.modify)

//cart op
	router.post('/cart/add/:bid/:iid/:pid/:amount',user.auth,cart.create)
	router.get('/cart/tips',user.auth,cart.tips)
	router.post('/cart/delete/:cid',user.auth,cart.delete)
	router.get('/cart/list',user.auth,cart.list)
	router.get('/cart/add/:cid/:num',cart.add)
	router.get('/cart/minus/:cid/:num',user.auth,cart.minus)
	router.get('/cart/set/:cid/:num',cart.set)
	router.post('/cart/check',user.auth,cart.check)
	router.get('/cart/checklist',user.auth,cart.checklist)

//address op
	router.post('/address/create',user.auth,address.create)

//order op

	router.post('/order/create',user.auth,order.create)


//myzone op

	router.get('/myzone/index',user.auth,myzone.index)
	router.get('/myzone/summerize/orders/latest',user.auth,myzone.orders_latest)
	router.get('/myzone/summerize/carts/latest',user.auth,myzone.carts_latest)
	router.get('/myzone/view/order/:oid',user.auth,myzone.order_detail)
	router.get('/myzone/view/orders/list',user.auth,myzone.order_list)
	router.post('/myzone/orders/batch',user.auth,myzone.batch_order)

//warehouse op
	router.get('/warehouse/map',user.auth,warehouse.map)
	router.post('/warehouse/create',user.auth,admin.auth,warehouse.create)

//ship op

	router.post('/ship/list',user.auth,ship.list)
	router.post('/ship/create',user.auth,admin.auth,ship.create)


}