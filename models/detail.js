"use strict";

module.exports = function(sequelize, DataTypes) {
  var Detail = sequelize.define("Detail", {
    amount:DataTypes.INTEGER,
    price:DataTypes.DOUBLE,
    market:DataTypes.DOUBLE,
    subtotal:DataTypes.DOUBLE,
    state:{type:DataTypes.INTEGER,defaultValue:1}
  },{
    classMethods: {
      associate: function(models) {
        Detail.belongsTo(models.User)
        Detail.belongsTo(models.Order)
        Detail.belongsTo(models.Ship)
        Detail.belongsTo(models.Pic)
        Detail.belongsTo(models.Item)
        Detail.belongsTo(models.Brand)
        Detail.belongsTo(models.Warehouse)
      }
    }
  });

  return Detail;
};