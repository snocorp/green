'use strict';

Template.Items.events({
  'click #new_item': function() {
    Router.go('items.new');
  }
});

Template.Items.helpers({
  items: function() {
    return Items.find({});
  }
})

Template.ItemsNew.events({
  'click #items_new_create_item': function(event, template) {
    var id = Items.insert({
      userId: Meteor.userId(),
      code: $('#items_new_code').val(),
      description: $('#items_new_description').val(),
      price: $('#items_new_price').val()
    });

    var params = Iron.controller().params;
    if (params.query.route) {
      var route = params.query.route;
      delete params.query.route;

      Router.go(route, params.query);
    } else {
      Router.go('items.show', {_id: id});
    }
  }
});

Template.InvoicesShow.helpers({
  item: function() {
    var id = Iron.controller().params._id;
    return Items.findOne(id);
  }
});
