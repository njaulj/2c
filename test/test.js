
var _= require('lodash')


function deep_vali(a,b,c){
	var b= b,c=c
	_.forEach(a,function(n,key){
		if(n){
			if(_.isObject(n)){
				b[key]={}
				deep_vali(n,b,key)
			}else{
				if(c){
					b[c][key]=n
				}else{
					b[key] =n
				}
			}
		}
	})
	return b
}
console.log(deep_vali({a:'b',c:{d:'d',e:'',f:'',g:'g'}},{},''))


var querystring = require('querystring')
var request = require('request')

var a ={key:'d4b257616c2d8d2a3cdac72df9e22822',
		tableid:'55aa1150e4b0a76fce3581dc',
		'data[_name]':'sadfa',
		'data[_location]':'123,90'}
var b = querystring.stringify(a)
var c =querystring.parse(b)
console.log(b)
console.log(c)

var needle = require('needle')

	var data= {
		key:'d4b257616c2d8d2a3cdac72df9e22822',
		tableid:'55aa1150e4b0a76fce3581dc',
		data:'{"_name":"safd","_location":"104.394729,31.125698"}'
	}


	request.post({url:'http://yuntuapi.amap.com/datamanage/data/create',form:data},function(err,resp,body){
		console.log(body)
	})


	var sdata={
		key:'d4b257616c2d8d2a3cdac72df9e22822',
		tableid:'55aa1150e4b0a76fce3581dc',
		city:'全国',
		keywords:'马群',
		limit:'50',
		page:'1'
	}

	var sdatas = querystring.stringify(sdata)

	console.log(sdatas)


	request('http://yuntuapi.amap.com/datasearch/local?tableid=55aa1150e4b0a76fce3581dc&city=%e5%85%a8%e5%9b%bd&keywords=%e9%a9%ac%e7%be%a4&limit=50&page=1&key=d4b257616c2d8d2a3cdac72df9e22822',function(err,resp){
		console.log(resp.body)
	})



	var yuntu = require('../config/some.json')['yuntu']


console.log(yuntu)

console.log(yuntu.key)


