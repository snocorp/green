'use strict';

Meteor.publish('item_prices', function() {
  return ItemPrices.find({});
});
