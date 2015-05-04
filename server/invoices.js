/* jshint node: true */
/* global Meteor, Invoices */
'use strict';

Meteor.publish('invoices', function() {
  return Invoices.find({userId: this.userId});
});
