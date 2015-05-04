/* jshint node: true */
/* global Meteor, ItemPrices */
'use strict';

Meteor.publish('item_prices', function() {
  return ItemPrices.find({userId: this.userId});
});
