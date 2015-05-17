Utils = {
  authorize: function(userId) {
    if (!userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in.');
    }
  },
  isNumber: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
};
