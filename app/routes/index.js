import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    // TODO: see services/game.js for analysis of this pattern
    return this.gameService.game.create({
      words: [
        'foo',
        'bar',
        'bittitan',
        'something'
      ]
    });
  },

  deactivate: function () {
    this.modelFor('index').destroy();
  },

  actions: {
    newGame: function () {
      this.refresh();
    },

    playLetter: function () {
      var game = this.modelFor('index');
      game.didEnterGuess();
    }
  }

});
