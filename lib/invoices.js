/* jshint node: true */
/* global Meteor, Router, Invoices, Utils, moment */
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

var validateInvoice = function(invoice) {
  var errors = {};
  var start = null;
  var end = null;
  var company = null;
  var customer = null;
  var services = null;
  var terms = null;
  var percentage = null;

  if (invoice) {
    start = invoice.start;
    end = invoice.end;
    company = invoice.company;
    customer = invoice.customer;
    services = invoice.services;
    terms = invoice.terms;
    percentage = invoice.percentage;
  }

  if (start === null || start.length === 0) {
    errors.start = 'Start date is required';
  } else if (!moment(start, 'YYYY-MM-DD').isValid()) {
    errors.start = 'Start date is not valid';
  }

  if (end === null || end.length === 0) {
    errors.end = 'End date is required';
  } else if (!moment(end, 'YYYY-MM-DD').isValid()) {
    errors.end = 'End date is not valid';
  }

  if (company !== null && company.length > 255) {
    errors.company = 'cannot be more than 255 characters';
  }

  if (customer !== null && customer.length > 255) {
    errors.customer = 'cannot be more than 255 characters';
  }

  if (services !== null && services.length > 255) {
    errors.services = 'cannot be more than 255 characters';
  }

  if (terms !== null && terms.length > 255) {
    errors.terms = 'cannot be more than 255 characters';
  }

  if (percentage !== null && !Utils.isNumber(percentage)) {
    errors.percentage = 'must be numeric';
  }

  if (Object.keys(errors).length > 0) {
    throw new Meteor.Error('invalid-item', 'One or more values are not valid.', errors);
  }
};

Meteor.methods({
  createInvoice: function(invoice) {
    Utils.authorize(this.userId);
    validateInvoice(invoice);

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
    Utils.authorize(this.userId, Invoices, id);
    validateInvoice(invoice);

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
    Utils.authorize(this.userId, Invoices, id);

    Invoices.update({
      _id: id
    }, {
      $set: {
        active: false
      }
    });
  }
});
