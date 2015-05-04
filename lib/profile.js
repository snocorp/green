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
    Meteor.users.update({_id: this.userId}, {
      $set: {
        'profile.company': profile.company
      }
    });
  }
});
