Meteor.startup(function () {
  if (Meteor.isServer) {
    Houston.add_collection(Meteor.users);
  }
});
