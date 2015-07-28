"use strict";

module.exports = function(sequelize, DataTypes) {
  var Packer = sequelize.define("Packer", {
    totalPv:{type:DataTypes.INTEGER,defaultValue:0}, //总单量 处理订单量
    successPv:{type:DataTypes.INTEGER,defaultValue:0}, //完结订单
    warningPv:{type:DataTypes.INTEGER,defaultValue:0}  //失败订单
  },{
    classMethods: {
      associate: function(models) {
        Packer.belongsTo(models.User)
        Packer.belongsTo(models.Warehouse)
        Packer.hasMany(models.Order)
        Packer.hasMany(models.Ship)
      }
    }
  }


  );

  return Packer;
};