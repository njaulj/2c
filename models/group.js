"use strict";



module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
     code : DataTypes.STRING, //分类码
     name : DataTypes.STRING, //描述
     pic : DataTypes.STRING,
     parent:DataTypes.INTEGER,  //父节点
     heavy:{type:DataTypes.INTEGER,defaultValue:10}
  },{
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Item)
        Group.hasMany(models.GroupMeta)
        Group.belongsToMany(models.Brand,{through:'GroupBrand'})
      }
    }
  }


  );

  return Group;
};