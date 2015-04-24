/* jslint node: true, jquery: true */
/* global Template */
'use strict';

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

Template.registerHelper('priceOf', function(item) {
  if (item) {
    return '$' + (item.price / 100).toFixed(2);
  } else {
    return false;
  }
});
