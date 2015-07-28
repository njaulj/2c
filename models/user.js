"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,	
    email: DataTypes.STRING,
    money: {type:DataTypes.DOUBLE,defaultValue:0.00},
    phone: DataTypes.STRING,
    orders: {type:DataTypes.INTEGER,defaultValue:0},
    total:{type:DataTypes.DOUBLE,defaultValue:0.00},
    isVali:{type:DataTypes.INTEGER,defaultValue:0}
  },{
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Address)
        User.hasMany(models.Cart)
        User.hasMany(models.Order)
      }
    }
  }


  );

  return User;
};