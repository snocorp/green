/* jshint node: true */
/* global Migrations, Invoices, InvoiceItems, Items, ItemPrices */
'use strict';

Migrations.add({
  version: 1,
  up: function() {
    var invoices = Invoices.find();
    invoices.forEach(function(invoice) {
      InvoiceItems.update(
        {invoiceId: invoice._id},
        {
          $set: {
            userId: invoice.userId
          }
        },
        {
          multi: true
        }
      );
    });

    var items = Items.find();
    items.forEach(function(item) {
      ItemPrices.update(
        {itemId: item._id},
        {
          $set: {
            userId: item.userId
          }
        },
        {
          multi: true
        }
      );
    });
  }
});

Migrations.migrateTo('latest');
