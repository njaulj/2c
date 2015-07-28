"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pic = sequelize.define("Pic", {
    picPath:DataTypes.STRING,
    cloudPath:DataTypes.STRING,
    picMeta:DataTypes.STRING,   //默认为 item名
    picSku:DataTypes.STRING,  // 种类
    picPrice:DataTypes.DOUBLE,
    picMarket:DataTypes.DOUBLE,
    picExt:DataTypes.STRING,
    amount:DataTypes.INTEGER,
    heavy:{type:DataTypes.INTEGER,defaultValue:10},
    state:{type:DataTypes.INTEGER,defaultValue:1} //用于区分是否有效
  },{
    classMethods: {
      associate: function(models) {
        Pic.belongsTo(models.Item)
      }
    }
  });

  return Pic;
};