/* jshint node: true */
/* global Meteor, Items */
'use strict';

Meteor.publish('items', function() {
  return Items.find({userId: this.userId});
});
