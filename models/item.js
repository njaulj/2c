"use strict";



module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    name: {type:DataTypes.STRING,allowNull:true}, //商品名称
    code: {type:DataTypes.STRING,allowNull:true}, //物料编码 or 特征码 为了更快的检索到商品
    desp: {type:DataTypes.TEXT,allowNull:true},	//商品描述 richtext
    shortDesp: {type:DataTypes.TEXT,allowNull:true}, //段描述
    meta: {type:DataTypes.TEXT,allowNull:true}, //商品参数详情 richtext
    keywords: {type:DataTypes.STRING,allowNull:true},
    pv:{type:DataTypes.INTEGER,defaultValue:0}, //pv
    sold:{type:DataTypes.INTEGER,defaultValue:0}, //已售
    inhand:{type:DataTypes.INTEGER,defaultValue:0}, //余量
    state: {type:DataTypes.INTEGER,defaultValue:1},  //当前状态 上架 或 下架
    saleStart:{type:DataTypes.DATE,allowNull:true}, //if state = '促销' we should use saleStart
    saleEnd:{type:DataTypes.DATE,allowNull:true}, //as upon
    istate: {type:DataTypes.INTEGER,defaultValue:0} //已上架的商品的状态
  },{
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Brand)
        Item.belongsTo(models.Group)
        Item.hasMany(models.Pic)
      }
    }
  }


  );

  return Item;
};