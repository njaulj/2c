var models = require('../../../models')
var Group = models.Group
var eventproxy = require('eventproxy')
var auth = require('../../../services/auth.js')

module.exports = function (router){
	router.get('/manage',auth.authUser,auth.authAdmin,group_manage)
	router.get('/show',auth.authUser,auth.authAdmin,show)
	router.post('/create',auth.authUser,auth.authAdmin,create)
	router.post('/update',auth.authUser,auth.authAdmin,update)
	router.post('/delete',auth.authUser,auth.authAdmin,del)
	router.get('/tree',auth.authUser,auth.authAdmin,tree)

}

function tree (req,res){
	if(req.query.parent == '#'){
		Group.findAll({
			where:{parent:0}
		})
		.then(function(groups){
			var ep = new eventproxy()
			ep.after('data',groups.length,function(data){
				res.json(data)
			})

			for (var i = 0 ;i < groups.length; i++){
				(function(i){
				var obj = {}
				obj.id = groups[i].id
				obj.icon = "fa fa-folder icon-lg icon-state-info"
				obj.text = groups[i].name
				obj.children = true
				obj.type = "root"
				ep.emit('data',obj)
			})(i)
			}
		})
	}else{
		Group.findAll({
			where:{parent:parseInt(req.query.parent)}
		})
		.then(function(groups){
			var ep = new eventproxy()
			ep.after('data',groups.length,function(data){
				res.json(data)
			})

			for (var i = 0 ;i < groups.length; i++){
				(function(i){
				var obj = {}
				obj.id = groups[i].id
				obj.icon = "fa fa-file icon-lg icon-state-success"
				obj.text = groups[i].name
				obj.children = false
				ep.emit('data',obj)
			})(i)
			}
		})
	}
}

//group/manage show
function show (req,res){
	var parent = req.query.id
		Group.findAll({
			where:{parent:parent}
		})
		.then(function(groups){
			if(groups.length>0){
			var ep = new eventproxy()
			ep.after('data',groups.length,function(data){
				var output = {}
				output.nodes = data
				res.json(output)
			})

			for (var i = 0 ;i < groups.length; i++){
				(function(i){
					trace(groups[i].parent,0,function(err,level){
						var obj = {}
						obj.id = groups[i].id
						obj.parent = groups[i].parent
						obj.name = groups[i].name
						obj.level = level
						obj.type = "folder"
						ep.emit('data',obj)
					})
				
			})(i)
			}
		
	}else{
		if(parent == '0'){
		Group.create({
			name:'酒水饮料',
			parent:0
		}).then(function(group){
			console.log(group)
			trace(group.parent,0,function(err,level){
			var obj = {}
				obj.id = group.id
				obj.parent = group.parent
				obj.name = group.name
				obj.level =level
				obj.type = "folder"
				var output ={}
				output.nodes = []
				output.nodes.push = obj
				res.json(output)
			})
		})
		}else{
			res.json({nodes:[]})
		}
	}
	})
}

//group/manage show
function create (req,res){

	Group.create({
		name:req.body.name,
		parent :parseInt(req.body.parent)
	}).then(function(group){
		var obj = {}
		obj.id = group.id
		obj.parent = group.parent
		obj.name = group.name
		obj.level = group.parent
		obj.type = "folder"
		res.json(obj)
	})
}

//group/manage show
function update (req,res){
	Group.findById(req.query.id)
	.then(function(group){
		group.name = req.body.name
		group
		.save()
		.then(function(group){
			var obj = {}
			obj.id = group.id
			obj.parent = group.parent
			obj.name = group.name
			obj.level = group.parent
			obj.type = "folder"
			res.json(obj)
		})
	})
}

//group/manage show
function del (req,res){
	Group.findById(req.query.id)
	.then(function(group){
		group
		.destroy()
		.then(function(){
			res.json({ok:'ok'})
		})
	})
}


function trace (parent,i,next){
	if(parent == 0){
		next(null,i)
	}else{
		Group.findById(parent)
		.then(function(group){
			if(group.parent == 0){
				i++
				next(null,i)
			}
			else{
				trace(group.parent,i+1,next)
			}
		})

	}
}


function group_manage (req,res){
	res.render('tree',{
		user:req.session.user
	})
}