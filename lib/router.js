/* jshint node: true */
/* global Meteor, Router */
'use strict';

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.render('Home');
  } else {
    this.next();
  }
});

Router.onAfterAction(function () {
  $('#navbar').collapse('hide');
})

Router.route('/', function () {
  this.redirect('/invoices');
});
