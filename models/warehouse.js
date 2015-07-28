"use strict";

module.exports = function(sequelize, DataTypes) {
  var Warehouse = sequelize.define("Warehouse", {
    longitude:DataTypes.DOUBLE,
    latitude:DataTypes.DOUBLE,
    name:DataTypes.STRING,
    city:DataTypes.STRING,
    contact:DataTypes.STRING,
    yuntuid:DataTypes.INTEGER
  },{
    classMethods: {
      associate: function(models) {
        Warehouse.belongsTo(models.User)
        Warehouse.hasMany(models.Packer)
        Warehouse.hasMany(models.Order)
        Warehouse.belongsToMany(models.Shipper,{through:'WarehouseShipper'})
      }
    }
  });
  return Warehouse;
};