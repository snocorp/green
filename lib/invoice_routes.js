'use strict';

Router.route('/invoices', {
  name: 'invoices',
  data: function () {
    return {
      invoices: Invoices.find({})
    };
  }
});

Router.route('/invoices/new', {
  name: 'invoices.new',
  data: function () {
    return {
      invoice: {
        period: {
          start: moment().format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD')
        },
        items: []
      }
    };
  }
});

Router.route('/invoices/:_id', {
  name: 'invoices.show',
  data: function() {
    return Invoices.findOne(this.params._id);
  }
});
