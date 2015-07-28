"use strict";

module.exports = function(sequelize, DataTypes) {
  var Cart = sequelize.define("Cart", {
    amount : DataTypes.INTEGER,
    state:{type:DataTypes.INTEGER,defaultValue:1}
  },{
    classMethods: {
      associate: function(models) {
        Cart.belongsTo(models.User)
        Cart.belongsTo(models.Item)
        Cart.belongsTo(models.Pic)
        Cart.belongsTo(models.Brand)
      }
    }
  });

  return Cart;
};