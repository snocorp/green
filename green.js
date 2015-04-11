'use strict';

var testInvoices = [
  {
    period: {
      start: "2015-01-01",
      end: "2015-01-15"
    },
    items: [
      {
        code: "MVA30",
        quantity: 12
      }
    ]
  }
];

var testItems = [
  {
    code: "MVA30",
    description: "MVA 30 Minute Massage",
    prices: {
      "current": 30.25,
      "2015-01-31": 29.75
    }
  },
  {
    code: "MVA60",
    description: "MVA 60 Minute Massage",
    prices: {
      "current": 58.25,
      "2015-01-31": 57.75
    }
  }
];

var Items = new Mongo.Collection("items");
var Invoices = new Mongo.Collection("invoices");

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.render('Home');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});

Router.route('/', function () {
  this.redirect('/invoices');
});

Router.route('/invoices', {
  name: 'invoices',
  data: function() {
    return Invoices.find({});
  }
});

Router.route('/invoices/new', {
  name: 'invoices.new'
});

Router.route('/items', {
  name: 'items',
  data: function() {
    return Items.find({});
  }
});

Router.route('/items/new', {
  name: 'items.new'
});

if (Meteor.isClient) {
  Template.Items.events({
    'click #new_item': function() {
      Router.go('/items/new');
    }
  });

  Template.Invoices.events({
    'click #new_invoice': function() {
      Router.go('/invoices/new');
    }
  });

  Template.InvoicesNew.onRendered(function() {
    $('#new_invoice_daterange').datepicker({
      orientation: "top auto"
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
