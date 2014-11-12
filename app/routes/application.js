import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    newGame: function () {
      this.transitionTo('games.new');
    }
  }
});
