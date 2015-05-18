/* jshint node: true */
/* global Meteor, Router, Utils */
'use strict';

Router.route('/profile', {
  name: 'profile'
});

Router.route('/profile/edit', {
  name: 'profile.edit'
});

var validateProfile = function(profile) {
  var errors = {};
  var company = null;
  var services = null;

  if (!profile) return;

  company = profile.company;
  services = profile.services;

  if (company && company.length > 255) {
    errors.company = 'Company cannot be longer than 255 characters.';
  }

  if (services && services.length > 255) {
    errors.services = 'Services cannot be longer than 255 characters.';
  }

  if (Object.keys(errors).length > 0) {
    throw new Meteor.Error('invalid-profile', 'One or more values are not valid.', errors);
  }
};

Meteor.methods({
  updateProfile: function(profile) {
    Utils.authorize(this.userId);
    validateProfile(profile);

    Meteor.users.update({_id: this.userId}, {
      $set: {
        'profile.company': profile.company,
        'profile.services': profile.services
      }
    });
  }
});
