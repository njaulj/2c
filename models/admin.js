"use strict";

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define("Admin", {
    state:{type:DataTypes.INTEGER,defaultValue:0}
  },{
    classMethods: {
      associate: function(models) {
        Admin.belongsTo(models.User)
      }
    }
  });

  return Admin;
};