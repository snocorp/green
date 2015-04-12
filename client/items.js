'use strict';

Meteor.subscribe('items');

Template.Items.events({
  'click #new_item': function() {
    Router.go('/items/new');
  }
});
