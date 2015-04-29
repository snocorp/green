/* jshint node: true */
/* global Meteor, Customers */
'use strict';

Meteor.publish('customers', function() {
  return Customers.find({userId: this.userId});
});
