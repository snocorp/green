'use strict';

Router.route('/invoices', {
  name: 'invoices'
});

Router.route('/invoices/new', {
  name: 'invoices.new'
});

Router.route('/invoices/:_id', {
  name: 'invoices.show'
});
