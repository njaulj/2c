"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pay = sequelize.define("Pay", {
    total:DataTypes.DOUBLE,
    method:DataTypes.INTEGER,
    state:{type:DataTypes.INTEGER,defaultValue:1}
  },{
    classMethods: {
      associate: function(models) {
        Pay.belongsTo(models.Order)
      }
  }
    });
  return Pay;
};