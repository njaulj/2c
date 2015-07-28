"use strict";



module.exports = function(sequelize, DataTypes) {
  var GroupMeta = sequelize.define("GroupMeta", {
      metaName : DataTypes.STRING
  },{
    classMethods: {
      associate: function(models) {
        GroupMeta.belongsTo(models.Group)
      }
    }
  }


  );

  return GroupMeta;
};