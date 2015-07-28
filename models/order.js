"use strict";

module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define("Order", {
  	total:DataTypes.DOUBLE,
    orderWhere:DataTypes.STRING,
    orderWho:DataTypes.STRING,
    orderContact:DataTypes.STRING,
    longitude:DataTypes.DOUBLE,
    latitude:DataTypes.DOUBLE,
    city:DataTypes.STRING,
    state:{type:DataTypes.INTEGER,defaultValue:1}
  },{
    classMethods: {
      associate: function(models) {
        Order.belongsTo(models.User)
        Order.hasMany(models.Detail)
      	Order.belongsTo(models.Packer)
      	Order.belongsTo(models.Warehouse)
      }
    }
  });

  return Order;
};