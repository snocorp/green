/* jshint node: true */
/* global Meteor, Router */
'use strict';

Router.route('/profile', {
  name: 'profile'
});

Router.route('/profile/edit', {
  name: 'profile.edit'
});

Meteor.methods({
  updateProfile: function(profile) {
    var errors = {};
    var company = profile.company;
    var services = profile.services;

    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update your profile.');
    }

    if (company && company.length > 255) {
      errors.company = 'Company cannot be longer than 255 characters.';
    }

    if (services && services.length > 255) {
      errors.services = 'Services cannot be longer than 255 characters.';
    }

    if (Object.keys(errors).length > 0) {
      throw new Meteor.Error('invalid-profile', 'One or more values are not valid.', errors);
    }

    Meteor.users.update({_id: this.userId}, {
      $set: {
        'profile.company': profile.company,
        'profile.services': profile.services
      }
    });
  }
});
