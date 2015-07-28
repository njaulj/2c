"use strict";

module.exports = function(sequelize, DataTypes) {
  var Shipper = sequelize.define("Shipper", {
    totalPv:{type:DataTypes.INTEGER,defaultValue:0}, //总单量
    state:{type:DataTypes.INTEGER,defaultValue:0},//当前状态 休息中、等待接单、派送中、抵达仓库等待派单、
    successPv:{type:DataTypes.INTEGER,defaultValue:0}, //及时送达
    warningPv:{type:DataTypes.INTEGER,defaultValue:0},  //超时送达
    failPv:{type:DataTypes.INTEGER,defaultValue:0}  //送达失败
  },{
    classMethods: {
      associate: function(models) {
        Shipper.belongsTo(models.User)
        Shipper.belongsToMany(models.Warehouse,{through:'WarehouseShipper'})
        Shipper.hasMany(models.Ship)
      }
    }
  }


  );

  return Shipper;
};