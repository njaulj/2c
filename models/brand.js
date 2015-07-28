"use strict";



module.exports = function(sequelize, DataTypes) {
  var Brand = sequelize.define("Brand", {
     brandName : DataTypes.STRING,
     brandPic : DataTypes.STRING,
     brandDesp : DataTypes.STRING,
     brandCountry : DataTypes.STRING,
     heavy:{type:DataTypes.INTEGER,defaultValue:10}
  },{
    classMethods: {
      associate: function(models) {
        Brand.hasMany(models.Item)
        Brand.belongsToMany(models.Group,{through:'GroupBrand'})
      }
    }
  }


  );

  return Brand;
};