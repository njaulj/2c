var models = require('../models')
var User = models.User
var Admin = models.Admin

function authUser (req,res,next){
    console.log(req.session.user)
	if(req.session.user){
		User
		.findById(req.session.user.id)
		.then(function(user){
			if(user){
				req.session.user = user
				next()
			}else{
			return	res.json({status:'error',msg:'no info'})
			}
		})
	}else{
		return res.redirect('/signin')
	}
}


function authAdmin(req,res,next){
    if(req.session.admin){
    	Admin
    	.find({
    		where:{UserId:req.session.user.id,state:1}
    		})
    	.then(function(admin){
    		if(admin){
                req.session.admin = admin.id
    			next()
    		}
    		else{
    			return res.json({status:'error',msg:'no permission'})
    		}
    	})
    }else{
        return res.json({status:'error',msg:'no permission'})
    }
}


exports.authUser = authUser
exports.authAdmin =authAdmin