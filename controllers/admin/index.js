var models = require('../../models')
var Admin = models.Admin
var auth = require('../../services/auth.js')

exports.create = function (req,res){
	Admin
	.build()
	.save()
	.then(function(admin){
		if(req.params.uid == req.session.user.id){
			admin.setUser(req.params.uid)
			.then(function(){
				res.json(admin)
			})
		}else{
			res.json({status:'failure'})
		}
		
	})
}



exports.auth = function (req,res,next){
	Admin
	.find({
		where:{UserId:req.session.user.id}
		})
	.then(function(admin){
		if(admin){
			next()
		}
		else{
			res.json({status:'error',msg:'no permission'})
		}
	})
}