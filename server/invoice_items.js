'use strict';

Meteor.publish('invoice_items', function() {
  return InvoiceItems.find();
});
