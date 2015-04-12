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
    return Invoices.find({});
  },
  hasInvoices: function () {
    return Invoices.find({}).count() > 0;
  }
});

Template.InvoicesNew.events({
  'change #new_invoice_period_start': function(event, template) {
    Session.set('invoices_new_start', $('#new_invoice_period_start').val());
  },
  'change #new_invoice_period_end': function(event, template) {
    Session.set('invoices_new_end', $('#new_invoice_period_end').val());
  },
  'click #create_invoice': function(event, template) {
    var id = Invoices.insert({
      userId: Meteor.userId(),
      start: $('#new_invoice_period_start').val(),
      end: $('#new_invoice_period_end').val()
    });

    Router.go('invoices.show', {_id: id});
  }
});

Template.InvoicesNew.helpers({
  start: function () {
    return Session.get('invoices_new_start');
  },
  end: function() {
    return Session.get('invoices_new_end');
  }
});

Template.InvoicesNew.onRendered(function() {
  $('#new_invoice_daterange').datepicker({
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
    console.log(invoiceId);
    InvoiceItems.insert({
      invoiceId: invoiceId,
      code: null,
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
  this.editing = new ReactiveVar(false);
});

Template.invoiceItem.events({
  'click #invoice_item_edit_invoice_item': function(event, template) {
    template.editing.set(true);
  },
  'click #invoice_item_edit_done': function(event, template) {
    template.editing.set(false);
  },
  'click #invoice_item_new_item': function(event, template) {
    console.log(Iron.controller());
    Router.go('items.new', {}, {query: "r=" + encodeURIComponent(Iron.controller().url)});
  }
});

Template.invoiceItem.helpers({
  isEditing: function() {
    return Template.instance().editing.get();
  },
  items: function() {
    return Items.find({});
  }
});
