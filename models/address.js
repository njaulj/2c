"use strict";

module.exports = function(sequelize, DataTypes) {
  var Address = sequelize.define("Address", {
    addressWho:DataTypes.STRING,
    addressWhere:DataTypes.STRING,
    addressContact:DataTypes.STRING,
    city:DataTypes.STRING,
    longitude:DataTypes.DOUBLE,
    latitude:DataTypes.DOUBLE,
    yuntuid:DataTypes.INTEGER
  },{
    classMethods: {
      associate: function(models) {
        Address.belongsTo(models.User)
      }
    }
  });

  return Address;
};