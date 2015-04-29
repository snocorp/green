/* jshint node: true */
/* global Meteor, InvoiceItems */
'use strict';

Meteor.methods({
  createInvoiceItem: function(invoiceId) {
    InvoiceItems.insert({
      invoiceId: invoiceId,
      itemId: null,
      quantity: 0
    });
  },
  updateInvoiceItem: function(id, invoiceItem) {
    InvoiceItems.update({
      _id: id
    }, {
      $set: {
        itemId: invoiceItem.itemId,
        quantity: invoiceItem.quantity
      }
    });
  },
  removeInvoiceItem: function(id) {
    InvoiceItems.remove(id);
  }
});
