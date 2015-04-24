/* jshint node: true, jquery: true */
/* global Meteor, ReactiveVar, Template, Iron, Router, moment, Items, ItemPrices */
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
      price: price * 100,
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

Template.ItemsShow.helpers({
  item: function() {
    var id = Iron.controller().params._id;
    return Items.findOne(id);
  }
});

Template.itemPrices.events({
  'click #item_prices_new_item_price': function() {
    var itemId = Iron.controller().params._id;
      ItemPrices.insert({
      itemId: itemId,
      untilDate: moment().format('YYYY-MM-DD'),
      price: 0
    });
  }
});

Template.itemPrices.helpers({
  item: function() {
    return Template.currentData();
  },
  prices: function() {
    var id = Iron.controller().params._id;
    return ItemPrices.find({itemId: id});
  }
});

Template.itemPrice.onCreated(function() {
  var untilToday = (Template.currentData().untilDate === moment().format('YYYY-MM-DD'));
  this.editing = new ReactiveVar(untilToday);
  this.priceError = new ReactiveVar('');
  this.untilDateError = new ReactiveVar('');
});

Template.itemPrice.onRendered(function() {
  $('#item_price_until_date_' + Template.currentData()._id).datepicker({
    format: "yyyy-mm-dd",
    orientation: "top auto"
  });
});

Template.itemPrice.events({
  'click .item_price_edit_item_price': function(event, template) {
    template.editing.set(true);

    Meteor.setTimeout((function(id) {
      return function() {
        $('#item_price_until_date_' + id).datepicker({
          format: "yyyy-mm-dd",
          orientation: "top auto"
        });
      };
    }(template.data._id)), 100);
  },
  'click .item_price_edit_done': function(event, template) {
    var error = false;
    var id = Template.currentData()._id;
    var untilDate = template.find('#item_price_until_date_' + id).value;
    var price = template.find('#item_price_price_' + id).value;

    if (untilDate === null || untilDate.length === 0) {
      template.untilDateError.set('Until date is required');
      error = true;
    } else if (!moment(untilDate, 'YYYY-MM-DD').isValid()) {
      template.untilDateError.set('Until date is not valid');
      error = true;
    } else {
      template.untilDateError.set('');
    }

    if (price === null || price.length === 0) {
      template.priceError.set('Price is required and must be numeric');
      error = true;
    } else if (!$.isNumeric(price)) {
      template.priceError.set('Price must be numeric');
      error = true;
    } else {
      template.priceError.set('');
    }

    if (error) return;

    ItemPrices.update({
      _id: id
    }, {
      $set: {
        untilDate: untilDate,
        price: price * 100
      }
    });

    template.editing.set(false);
  }
});

Template.itemPrice.helpers({
  isEditing: function() {
    return Template.instance().editing.get();
  },
  priceError: function() {
    return Template.instance().priceError.get();
  },
  untilDateError: function() {
    return Template.instance().untilDateError.get();
  },
  price: function() {
    return Template.currentData().price / 100;
  }
});
