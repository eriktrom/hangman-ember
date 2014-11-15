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
      this._submitGuess(game);
      this._resetCurrentGuess(game);
    }
  },

  _submitGuess: function (game) {
    if (game.get('currentGuess')) {
      game.decrementProperty('remaining');
    }
  },

  _resetCurrentGuess: function (game) {
    Ember.run.next(function () {
      game.set('currentGuess', null);
    });
  }

});
