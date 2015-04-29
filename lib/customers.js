/* jshint node: true */
/* global Meteor, Router, Customers */
'use strict';

Router.route('/customers', {
  name: 'customers'
});

Router.route('/customers/new', {
  name: 'customers.new'
});

Router.route('/customers/:_id', {
  name: 'customers.show'
});

Router.route('/customers/:_id/edit', {
  name: 'customers.edit'
});

Meteor.methods({
  createCustomer: function(customer) {
    var id = Customers.insert({
      userId: this.userId,
      name: customer.name,
      description: customer.description,
      active: true
    });

    return {
      id: id
    };
  },
  updateCustomer: function(id, customer) {
    Customers.update({
      _id: id
    }, {
      $set: {
        name: customer.name,
        description: customer.description,
        active: true
      }
    });
  },
  archiveCustomer: function(id) {
    Customers.update({
      _id: id
    }, {
      $set: {
        active: false
      }
    });
  }
});
