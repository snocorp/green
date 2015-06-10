/* jshint node: true, jquery: true */
/* global Meteor, ReactiveVar, Template, Iron, Router, moment, Items, ItemPrices */
'use strict';

Template.Items.onCreated(function() {
  this.displayArchived = new ReactiveVar(false);
});

Template.Items.events({
  'click #items_toggle_display_archived': function(event, template) {
    var value = Template.instance().displayArchived.get();
    Template.instance().displayArchived.set(!value);
  }
});

Template.Items.helpers({
  items: function() {
    var selector = {
      userId: Meteor.userId()
    };

    if (!Template.instance().displayArchived.get()) {
      selector.active = true;
    }

    return Items.find(selector, {
      sort: {
        code: 1
      }
    });
  },
  displayArchived: function() {
    return Template.instance().displayArchived.get();
  }
});

Template.item.helpers({
  price: function() {
    return Template.currentData().price / 100;
  }
});

var handleItemError = function(error, template) {
  if (error) {
    if (error.details.code) {
      template.codeError.set(error.details.code);
    } else {
      template.codeError.set('');
    }

    if (error.details.description) {
      template.descriptionError.set(error.details.description);
    } else {
      template.descriptionError.set('');
    }

    if (error.details.price) {
      template.priceError.set(error.details.price);
    } else {
      template.priceError.set('');
    }

    return true;
  } else {
    template.codeError.set('');
    template.descriptionError.set('');
    template.priceError.set('');

    return false;
  }
};

Template.ItemsNew.onCreated(function() {
  this.codeError = new ReactiveVar('');
  this.descriptionError = new ReactiveVar('');
  this.priceError = new ReactiveVar('');
});

Template.ItemsNew.events({
  'click #items_new_create_item': function(event, template) {
    var code = template.find('#items_new_code').value;
    var description = template.find('#items_new_description').value;
    var price = template.find('#items_new_price').value;
    if ($.isNumeric(price)) {
      price *= 100;
    }

    var params = Iron.controller().params;

    Meteor.call(
      'insertItem',
      {
        code: code,
        description: description,
        price: price
      },
      function(error, result) {
        if (!handleItemError(error, template)) {
          if (params.query.route) {
            var route = params.query.route;
            delete params.query.route;

            Router.go(route, params.query);
          } else {
            Router.go('items.show', {_id: result.id});
          }
        }
      }
    );
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

Template.ItemsEdit.onCreated(function() {
  this.codeError = new ReactiveVar('');
  this.descriptionError = new ReactiveVar('');
  this.priceError = new ReactiveVar('');
});

Template.ItemsEdit.events({
  'click #items_edit_update_item': function(event, template) {
    var error = false;
    var code = template.find('#items_edit_code').value;
    var description = template.find('#items_edit_description').value;
    var price = template.find('#items_edit_price').value;
    if ($.isNumeric(price)) {
      price *= 100;
    }

    var id = Iron.controller().params._id;
    var params = Iron.controller().params;
    Meteor.call(
      'updateItem',
      id,
      {
        code: code,
        description: description,
        price: price
      },
      function(error, result) {
        if (handleItemError(error, template)) return;

        if (params.query.route) {
          var route = params.query.route;
          delete params.query.route;

          Router.go(route, params.query);
        } else {
          Router.go('items.show', {_id: id});
        }
      }
    );
  },
  'click #items_edit_cancel': function(event, template) {
    var id = Iron.controller().params._id;
    Router.go('items.show', {_id: id});
  }
});

Template.ItemsEdit.helpers({
  item: function() {
    var id = Iron.controller().params._id;
    return Items.findOne(id);
  },
  price: function() {
    var id = Iron.controller().params._id;
    var item = Items.findOne(id);
    if (item) {
      return (item.price / 100).toFixed(2);
    } else {
      return false;
    }
  }
});

Template.ItemsEdit.helpers({
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

Template.ItemsShow.events({
  'click #items_show_edit_item': function() {
    var id = Iron.controller().params._id;
    Router.go('items.edit', {_id: id});
  },
  'click #items_show_remove_item': function() {
    var id = Iron.controller().params._id;
    Meteor.call('archiveItem', id);
  }
});

Template.ItemsShow.helpers({
  item: function() {
    var id = Iron.controller().params._id;
    return Items.findOne(id);
  }
});

var handleItemPriceError = function(error, template) {
  if (error) {
    if (error.details.untilDate) {
      template.untilDateError.set(error.details.untilDate);
    } else {
      template.untilDateError.set('');
    }

    if (error.details.price) {
      template.priceError.set(error.details.price);
    } else {
      template.priceError.set('');
    }

    return true;
  } else {
    template.untilDateError.set('');
    template.priceError.set('');

    return false;
  }
};

Template.itemPrices.events({
  'click #item_prices_new_item_price': function(event, template) {
    var itemId = Iron.controller().params._id;
    Meteor.call(
      'createItemPrice',
      itemId,
      function(error, result) {
        handleItemPriceError(error, template);
      }
    );
  }
});

Template.itemPrices.helpers({
  item: function() {
    return Template.currentData();
  },
  price: function() {
    var item = Template.currentData();
    if (item) {
      return item.price / 100;
    } else {
      return false;
    }
  },
  prices: function() {
    var id = Iron.controller().params._id;
    return ItemPrices.find({itemId: id}, {
      sort: { untilDate : -1 }
    });
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
  'click .item_price_remove_item_price': function(event, template) {
    var id = template.data._id;
    Meteor.call('removeItemPrice', id);
  },
  'click .item_price_edit_done': function(event, template) {
    var id = Template.currentData()._id;
    var untilDate = template.find('#item_price_until_date_' + id).value;
    var price = template.find('#item_price_price_' + id).value;
    if ($.isNumeric(price)) {
      price *= 100;
    }

    Meteor.call(
      'updateItemPrice',
      id,
      {
        untilDate: untilDate,
        price: price
      },
      function(error, result) {
        if (handleItemPriceError(error, template)) return;

        template.editing.set(false);
      }
    );


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
