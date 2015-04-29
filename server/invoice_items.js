/* jshint node: true */
/* global Meteor, InvoiceItems */
'use strict';

Meteor.publish('invoice_items', function() {
  return InvoiceItems.find();
});
