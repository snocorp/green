/* jshint node: true, jquery: true */
/* global Meteor, Template, Router */
'use strict';

Template.Profile.events({
  'click #profile_edit_profile': function(event, template) {
    Router.go('profile.edit');
  }
});

Template.Profile.helpers({
  'company': function() {
    var user = Meteor.user();
    if (user) {
      return user.profile.company;
    } else {
      return false;
    }
  },
  'services': function() {
    var user = Meteor.user();
    if (user) {
      return user.profile.services;
    } else {
      return false;
    }
  }
});

Template.ProfileEdit.events({
  'click #profile_edit_update_profile': function(event, template) {
    var company = template.find('#profile_edit_company').value;
    var services = template.find('#profile_edit_services').value;

    Meteor.call('updateProfile', {
        company: company,
        services: services
      },
      function(error, result) {
        Router.go('profile');
      }
    );
  },
  'click #profile_edit_cancel': function(event, template) {
    Router.go('profile');
  }
});

Template.ProfileEdit.helpers({
  'company': function() {
    var user = Meteor.user();
    if (user) {
      return user.profile.company;
    } else {
      return false;
    }
  },
  'services': function() {
    var user = Meteor.user();
    if (user) {
      return user.profile.services;
    } else {
      return false;
    }
  }
});
