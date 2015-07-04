/* jshint node: true, jquery: true */
/* global Meteor, Accounts, ReactiveVar, Session, Template */
'use strict';

Session.set('accountsMode', 'register');
Session.set('email', '');

Template.Home.events({
  'click #createAccount': function(event) {
    Session.set('accountsMode', 'register');
    return false;
  },
  'click #forgotPassword': function(event) {
    Session.set('accountsMode', 'forgot');
    return false;
  },
  'click #existingAccount': function(event) {
    Session.set('accountsMode', 'login');
    return false;
  }
});

Template.Home.helpers({
  'registerMode': function() {
    return Session.get('accountsMode') === 'register';
  },
  'loginMode': function() {
    return Session.get('accountsMode') === 'login';
  },
  'forgotMode': function() {
    return Session.get('accountsMode') === 'forgot';
  },
  'forgotEmailSent': function() {
    return Session.get('forgotEmailSent');
  }
});

Template.register.onCreated(function() {
  this.registerError = new ReactiveVar(false);
});

Template.register.helpers({
  email: function() {
    return Session.get('email');
  },
  hasError: function() {
    return Template.instance().registerError.get() ? 'has-error' : false;
  },
  registerError: function() {
    return Template.instance().registerError.get();
  }
});

Template.register.events({
  'submit form': function(event, template) {
    event.preventDefault();

    var email = event.target.registerEmail.value;
    var password = event.target.registerPassword.value;

    Accounts.createUser({
      email: email,
      password: password
    }, function(err) {
      if (err) {
        template.registerError.set(err.reason || err.message);
      }
    });

    return false;
  },
  'change #registerEmail': function(event) {
    Session.set('email', event.target.value);

    return true;
  }
});

Template.login.onCreated(function() {
  this.loginError = new ReactiveVar(false);
});

Template.login.helpers({
  email: function() {
    return Session.get('email');
  },
  hasError: function() {
    return Template.instance().loginError.get() ? 'has-error' : false;
  },
  loginError: function() {
    return Template.instance().loginError.get();
  }
});

Template.login.events({
  'submit form': function(event, template) {
    event.preventDefault();

    var email = event.target.loginEmail.value;
    var password = event.target.loginPassword.value;

    Meteor.loginWithPassword(
      email,
      password,
      function(err) {
        if (err) {
          template.loginError.set(err.reason || err.message);
        }
      });

    return false;
  },
  'change #loginEmail': function(event) {
    Session.set('email', event.target.value);

    return true;
  }
});

Template.forgot.onCreated(function() {
  this.forgotEmailSent = new ReactiveVar(false);
  this.forgotEmailError = new ReactiveVar(false);
});

Template.forgot.helpers({
  hasSuccess: function() {
    return Template.instance().forgotEmailSent.get() ? 'has-success' : false;
  },
  hasError: function() {
    return Template.instance().forgotEmailError.get() ? 'has-error' : false;
  },
  forgotEmailError: function() {
    return Template.instance().forgotEmailError.get();
  }
});

Template.forgot.events({
  'submit form': function(event, template) {
    event.preventDefault();

    var email = event.target.forgotEmail.value;

    Accounts.forgotPassword({
      email: email
    }, function(err) {
      if (err) {
        template.forgotEmailError.set(err.reason || err.message);
        template.forgotEmailSent.set(false);
      } else {
        template.forgotEmailSent.set(true);
      }
    });

    return false;
  }
});
