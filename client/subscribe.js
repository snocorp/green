/* jshint node: true */
/* global Meteor */
'use strict';

Meteor.subscribe('items');
Meteor.subscribe('item_prices');
Meteor.subscribe('invoices');
Meteor.subscribe('invoice_items');
Meteor.subscribe('customers');
