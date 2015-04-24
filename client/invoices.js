/* jshint node: true, jquery: true */
/* global Meteor, ReactiveVar, Session, Template, Iron, Router, moment,
          Invoices, InvoiceItems, Items */
'use strict';

var date = moment().format('YYYY-MM-DD');
Session.set('invoices_new_start', date);
Session.set('invoices_new_end', date);

Template.Invoices.events({
  'click #invoices_new_invoice': function() {
    Router.go('invoices.new');
  }
});

Template.Invoices.helpers({
  invoices: function() {
    return Invoices.find({userId: Meteor.userId()});
  }
});

Template.InvoicesNew.onCreated(function() {
  this.startError = new ReactiveVar('');
  this.endError = new ReactiveVar('');
});

Template.InvoicesNew.events({
  'change #invoices_new_start': function(event, template) {
    Session.set('invoices_new_start', $('#invoices_new_start').val());
  },
  'change #invoices_new_end': function(event, template) {
    Session.set('invoices_new_end', $('#invoices_new_end').val());
  },
  'click #invoices_new_create_invoice': function(event, template) {
    var error = false;
    var start = template.find('#invoices_new_start').value;
    var end = template.find('#invoices_new_end').value;

    if (start === null || start.length === 0) {
      template.startError.set('Start date is required');
      error = true;
    } else if (!moment(start, 'YYYY-MM-DD').isValid()) {
      template.startError.set('Start date is not a valid date');
      error = true;
    } else {
      template.startError.set('');
    }

    console.log(moment(start, 'YYYY-MM-DD'));

    if (end === null || end.length === 0) {
      template.endError.set('End date is required');
      error = true;
    } else if (!moment(end, 'YYYY-MM-DD').isValid()) {
      template.endError.set('End date is not a valid date');
      error = true;
    } else {
      template.endError.set('');
    }

    console.log(moment(end, 'YYYY-MM-DD'));

    if (error) return;

    var id = Invoices.insert({
      userId: Meteor.userId(),
      start: start,
      end: end
    });

    Router.go('invoices.show', {_id: id});
  },
  'click #invoices_new_cancel': function(event, template) {
    Router.go('invoices');
  }
});

Template.InvoicesNew.helpers({
  startError: function() {
    return Template.instance().startError.get();
  },
  endError: function() {
    return Template.instance().endError.get();
  },
  start: function () {
    return Session.get('invoices_new_start');
  },
  end: function() {
    return Session.get('invoices_new_end');
  }
});

Template.InvoicesNew.onRendered(function() {
  $('#invoices_new_daterange').datepicker({
    format: "yyyy-mm-dd",
    orientation: "top auto"
  });
});

Template.InvoicesShow.helpers({
  invoice: function() {
    var id = Iron.controller().params._id;
    return Invoices.findOne(id);
  }
});

Template.invoiceItems.events({
  'click #invoice_items_new_invoice_item': function() {
    var invoiceId = Iron.controller().params._id;
    InvoiceItems.insert({
      invoiceId: invoiceId,
      itemId: null,
      quantity: 0
    });
  }
});

Template.invoiceItems.helpers({
  items: function() {
    var id = Iron.controller().params._id;
    return InvoiceItems.find({invoiceId: id});
  }
});

Template.invoiceItem.onCreated(function() {
  var hasItem = (Template.currentData().itemId === null);
  this.editing = new ReactiveVar(hasItem);
  this.quantityError = new ReactiveVar('');
});

Template.invoiceItem.events({
  'click .invoice_item_edit_invoice_item': function(event, template) {
    template.editing.set(true);
  },
  'click .invoice_item_edit_done': function(event, template) {
    var error = false;
    var id = Template.currentData()._id;
    var item = template.find('#invoice_item_item_' + id).value;
    var quantity = template.find('#invoice_item_quantity_' + id).value;

    if (quantity === null || quantity.length === 0) {
      template.quantityError.set('Quantity is required and must be numeric');
      error = true;
    } else if (!$.isNumeric(quantity)) {
      template.quantityError.set('Quantity must be numeric');
      error = true;
    } else {
      template.quantityError.set('');
    }

    if (error) return;

    InvoiceItems.update({
      _id: id
    }, {
      $set: {
        itemId: item,
        quantity: quantity
      }
    });

    template.editing.set(false);
  },
  'click #invoice_item_new_item': function(event, template) {
    console.log(Iron.controller());
    Router.go('items.new', {}, {query: "route=invoices.show&_id=" + encodeURIComponent(Iron.controller().params._id)});
  }
});

Template.invoiceItem.helpers({
  isEditing: function() {
    return Template.instance().editing.get();
  },
  quantityError: function() {
    return Template.instance().quantityError.get();
  },
  items: function() {
    return Items.find({userId: Meteor.userId()});
  },
  itemCode: function() {
    var itemId = Template.currentData().itemId,
      code = null;

    if (itemId) {
      code = Items.findOne(itemId).code;
    }

    return code;
  },
  itemDescription: function() {
    var itemId = Template.currentData().itemId,
      description = null;

    if (itemId) {
      description = Items.findOne(itemId).description;
    }

    return description;
  }
});
