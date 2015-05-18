Utils = {
  authorize: function(userId, collection, id) {
    if (!userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in.');
    }

    if (id) {
      var doc = collection.findOne({_id: id, userId: userId});
      if (!doc) {
        throw new Meteor.Error('unauthorized', 'You do not have access to the given resource.')
      }
    }
  },
  isNumber: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
};
