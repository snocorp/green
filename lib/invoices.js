/* jshint node: true */
/* global Meteor, Router, Invoices */
'use strict';

Router.route('/invoices', {
  name: 'invoices'
});

Router.route('/invoices/new', {
  name: 'invoices.new'
});

Router.route('/invoices/:_id', {
  name: 'invoices.show'
});

Router.route('/invoices/:_id/edit', {
  name: 'invoices.edit'
});

Meteor.methods({
  createInvoice: function(invoice) {
    var id = Invoices.insert({
      userId: this.userId,
      start: invoice.start,
      end: invoice.end,
      company: invoice.company,
      customer: invoice.customer,
      services: invoice.services,
      terms: invoice.terms,
      percentage: invoice.percentage,
      active: true
    });

    return {
      id: id
    };
  },
  updateInvoice: function(id, invoice) {
    Invoices.update({
      _id: id
    }, {
      $set: {
        start: invoice.start,
        end: invoice.end,
        company: invoice.company,
        customer: invoice.customer,
        services: invoice.services,
        terms: invoice.terms,
        percentage: invoice.percentage,
        active: true
      }
    });
  },
  archiveInvoice: function(id) {
    Invoices.update({
      _id: id
    }, {
      $set: {
        active: false
      }
    });
  }
});
