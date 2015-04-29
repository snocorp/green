/* jshint node: true */
/* global Meteor, ItemPrices, moment */
'use strict';

Meteor.methods({
  createItemPrice: function(itemId) {
    ItemPrices.insert({
      itemId: itemId,
      untilDate: moment().format('YYYY-MM-DD'),
      price: 0
    });
  },
  updateItemPrice: function(id, itemPrice) {
    ItemPrices.update({
      _id: id
    }, {
      $set: {
        untilDate: itemPrice.untilDate,
        price: itemPrice.price
      }
    });
  },
  removeItemPrice: function(id) {
    ItemPrices.remove(id);
  }
});
