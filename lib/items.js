/* jshint node: true */
/* global Meteor, Router, Items */
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

Meteor.methods({
  insertItem: function(item) {
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
    Items.update({
      _id: id
    }, {
      $set: {
        active: false
      }
    });
  }
});
