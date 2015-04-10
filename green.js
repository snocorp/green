testInvoices = [
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
]

testItems = [
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
]
Items = new Mongo.Collection("items");
Invoices = new Mongo.Collection("invoices");

if (Meteor.isClient) {

  Router.route('/', function () {
    this.layout('layout');
    this.render('invoices', {
      invoices: function() {
        return Invoices.find({});
      }
    });
  });

  Router.route('/items', function () {
    this.layout('layout');
    this.render('items', {
      items: function() {
        return Items.find({});
      }
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
