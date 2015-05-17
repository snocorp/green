/* jshint node: true */
/* global Meteor, ItemPrices, Utils, moment */
'use strict';

var validateItemPrice = function(itemPrice) {
  var errors = {};
  var untilDate = null;
  var price = null;

  if (itemPrice !== null) {
    untilDate = itemPrice.untilDate;
    price = itemPrice.price;
  }

  if (untilDate === null || untilDate.length === 0) {
    errors.untilDate = 'Until date is required';
  } else if (!moment(untilDate, 'YYYY-MM-DD').isValid()) {
    errors.untilDate = 'Until date is not valid';
  }

  if (price === null || price.length === 0) {
    errors.price = 'Price is required and must be numeric';
  } else if (!Utils.isNumber(price)) {
    errors.price = 'Price must be numeric';
  }

  if (Object.keys(errors).length > 0) {
    throw new Meteor.Error('invalid-item', 'One or more values are not valid.', errors);
  }
};

Meteor.methods({
  createItemPrice: function(itemId) {
    Utils.authorize(this.userId);

    ItemPrices.insert({
      userId: this.userId,
      itemId: itemId,
      untilDate: moment().format('YYYY-MM-DD'),
      price: 0
    });
  },
  updateItemPrice: function(id, itemPrice) {
    Utils.authorize(this.userId);

    validateItemPrice(itemPrice);

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
    Utils.authorize(this.userId);

    ItemPrices.remove(id);
  }
});
