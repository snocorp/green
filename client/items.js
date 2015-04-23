/* jshint node: true, jquery: true */
/* global Meteor, ReactiveVar, Template, Iron, Router, Items */
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
});

Template.ItemsNew.onCreated(function() {
  this.codeError = new ReactiveVar('');
  this.descriptionError = new ReactiveVar('');
  this.priceError = new ReactiveVar('');
});

Template.ItemsNew.helpers({
  codeError: function() {
    return Template.instance().codeError.get();
  },
  descriptionError: function() {
    return Template.instance().descriptionError.get();
  },
  priceError: function() {
    return Template.instance().priceError.get();
  }
});

Template.ItemsNew.events({
  'click #items_new_create_item': function(event, template) {
    var error = false;
    var code = template.find('#items_new_code').value;
    var description = template.find('#items_new_description').value;
    var price = template.find('#items_new_price').value;

    if (code === null || code.length === 0) {
      template.codeError.set('is required');
      error = true;
    } else {
      template.codeError.set('');
    }

    if (description === null || description.length === 0) {
      template.descriptionError.set('is required');
      error = true;
    } else {
      template.descriptionError.set('');
    }

    if (price === null || price.length === 0) {
      template.priceError.set('is required');
      error = true;
    } else if (!$.isNumeric(price)) {
      template.priceError.set('must be numeric');
      error = true;
    } else {
      template.priceError.set('');
    }

    if (error) return;

    var id = Items.insert({
      userId: Meteor.userId(),
      code: code,
      description: description,
      price: price,
      active: true
    });

    var params = Iron.controller().params;
    if (params.query.route) {
      var route = params.query.route;
      delete params.query.route;

      Router.go(route, params.query);
    } else {
      Router.go('items.show', {_id: id});
    }
  },
  'click #items_new_cancel': function(event, template) {
    var params = Iron.controller().params;
    if (params.query.route) {
      var route = params.query.route;
      delete params.query.route;

      Router.go(route, params.query);
    } else {
      Router.go('items');
    }
  }
});

Template.InvoicesShow.helpers({
  item: function() {
    var id = Iron.controller().params._id;
    return Items.findOne(id);
  }
});
