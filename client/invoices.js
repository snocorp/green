'use strict';

Meteor.subscribe('invoices');

Template.Invoices.events({
  'click #new_invoice': function() {
    Router.go('/invoices/new');
  }
});

Template.Invoices.helpers({
  hasInvoices: function () {
    return Iron.controller().data().invoices.count() > 0;
  }
});

Template.InvoicesNew.events({
  'click #create_invoice': function(event, template) {
    var id = Invoices.insert({
      period: {
        userId: Meteor.userId(),
        start: $('#new_invoice_period_start').val(),
        end: $('#new_invoice_period_end').val()
      },
      items: []
    });

    Router.go('invoices.show', {_id: id});
  }
});

Template.InvoicesNew.onRendered(function() {
  $('#new_invoice_daterange').datepicker({
    format: "yyyy-mm-dd",
    orientation: "top auto"
  });
});
