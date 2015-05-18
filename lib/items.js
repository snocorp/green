/* jshint node: true */
/* global Meteor, Router, Items, Utils */
'use strict';

Router.route('/items', {
  name: 'items'
});

Router.route('/items/new', {
  name: 'items.new'
});

Router.route('/items/:_id', {
  name: 'items.show'
});

Router.route('/items/:_id/edit', {
  name: 'items.edit'
});

var validateItem = function(item, userId) {
  var errors = {};
  var code = item.code;
  var description = item.description;
  var price = item.price;

  if (code === null || code.length === 0) {
    errors.code = 'is required';
  } else if (code.length > 8) {
    errors.code = 'cannot be more than 8 characters';
  }

  if (description === null || description.length === 0) {
    errors.description = 'is required';
  } else if (description.length > 255) {
    errors.description = 'cannot be more than 255 characters';
  }

  if (price === null || price.length === 0) {
    errors.price = 'is required and must be numeric';
  } else if (!Utils.isNumber(price)) {
    errors.price = 'must be numeric';
  }

  if (Object.keys(errors).length > 0) {
    throw new Meteor.Error('invalid-item', 'One or more values are not valid.', errors);
  }
};

Meteor.methods({
  insertItem: function(item) {
    Utils.authorize(this.userId);
    validateItem(item, this.userId);

    var id = Items.insert({
      userId: this.userId,
      code: item.code,
      description: item.description,
      price: item.price,
      active: true
    });

    return {
      id: id
    };
  },
  updateItem: function(id, item) {
    Utils.authorize(this.userId, Items, id);
    validateItem(item, this.userId);

    Items.update({
      _id: id
    }, {
      $set: {
        code: item.code,
        description: item.description,
        price: item.price,
        active: true
      }
    });
  },
  archiveItem: function(id) {
    Utils.authorize(this.userId, Items, id);

    Items.update({
      _id: id
    }, {
      $set: {
        active: false
      }
    });
  }
});
