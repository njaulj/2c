"use strict";

module.exports = function(sequelize, DataTypes) {
  var Ship = sequelize.define("Ship", {
    shipno:DataTypes.STRING,
    shipby:DataTypes.STRING,
    shipWhere:DataTypes.STRING,
    shipWho:DataTypes.STRING,
    shipContact:DataTypes.STRING
  },{
    classMethods: {
      associate: function(models) {
        Ship.hasMany(models.Detail)
        Ship.belongsTo(models.Warehouse)
        Ship.belongsTo(models.Shipper)
        Ship.belongsTo(models.Packer)
        Ship.belongsTo(models.Order)
      }
    }
  });
  return Ship;
};