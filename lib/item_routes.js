/* jshint node: true */
/* global Router */
'use strict';

Router.route('/items', {
  name: 'items'
});

Router.route('/items/new', {
  name: 'items.new'
});

Router.route('/items/:_id', {
  name: 'items.show'
});

Router.route('/items/:_id/edit', {
  name: 'items.edit'
});
