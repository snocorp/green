/* jslint node: true, jquery: true */
/* global Template */
'use strict';

Template.registerHelper('isArchived', function(item) {
  console.log(item);
  if (item && !item.active) {
    return 'archived';
  } else {
    return false;
  }
});

Template.registerHelper('hasError', function(error) {
  return (
    error !== null &&
    $.type(error) === 'string' &&
    error.length > 0
    ) ? 'has-error' : '';
});

Template.registerHelper('selectedIfEquals', function(a, b) {
  return (a === b) ? 'selected' : '';
});

Template.registerHelper('fmtPrice', function(price) {
  if (price) {
    return '$' + price.toFixed(2);
  } else {
    return '$0.00';
  }
});
