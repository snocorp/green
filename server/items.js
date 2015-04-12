'use strict';

Meteor.publish('items', function() {
  return Items.find();
});
