/* jshint node: true, jquery: true */
/* global Meteor, Template, ReactiveVar, Router */
'use strict';

Template.Profile.helpers({
  'company': function() {
    var user = Meteor.user();
    if (user && user.profile && user.profile.company) {
      return user.profile.company;
    } else {
      return false;
    }
  },
  'services': function() {
    var user = Meteor.user();
    if (user && user.profile && user.profile.services) {
      return user.profile.services;
    } else {
      return false;
    }
  }
});

Template.ProfileEdit.onCreated(function() {
  this.companyError = new ReactiveVar('');
  this.servicesError = new ReactiveVar('');

  var user = Meteor.user();
  var company = false;
  if (user && user.profile && user.profile.company) {
    company = user.profile.company;
  }
  this.company = new ReactiveVar(company);
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
        if (error) {
          if (error.details.company) {
            template.companyError.set(error.details.company);
          } else {
            template.companyError.set('');
          }

          if (error.details.services) {
            template.servicesError.set(error.details.services);
          } else {
            template.servicesError.set('');
          }
        } else {
          template.companyError.set('');
          template.servicesError.set('');

          Router.go('profile');
        }
      }
    );
  },
  'click #profile_edit_cancel': function(event, template) {
    Router.go('profile');
  },
  'keyup, change #profile_edit_company': function(event, template) {
    var company = template.find('#profile_edit_company').value;

    template.company.set(company);

    return true;
  }
});

Template.ProfileEdit.helpers({
  companyError: function() {
    return Template.instance().companyError.get();
  },
  servicesError: function() {
    return Template.instance().servicesError.get();
  },
  company: function() {
    return Template.instance().company.get();
  },
  services: function() {
    var user = Meteor.user();
    if (user && user.profile && user.profile.services) {
      return user.profile.services;
    } else {
      return false;
    }
  }
});
