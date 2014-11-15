import Ember from 'ember';

// Explanation of this pattern:
// - basically I wanted 'instances' of 'an object' each time you reload the route
// - controllers are singletons
// - models are persistant
// - an 'object' is perfect, it allows state to be setup and torn down, the right
//   tool for the job here IMO
// - where it went wrong
//    - services are auto instantiated by the application, but only in the
//      app, not in the tests, something I was not aware of as I was doing TDD :(
//    - thus, i nested a property inside this service that I could instantiate, it
//      was a quick hack that solved the problem without much work
//    - in the future i believe a better understanding of the container would
//      allow me to inject this factory into the container, instead of the application
//      at which point I could instantiate it myself, removing the odd game.create
//      nesting we have here

export default Ember.Object.extend({
  game: Ember.Object.extend(Ember.Evented, {
    disabled: false,
    gameOver: false,
    currentGuess: null,
    shownLetters: null,
    badLetters: null,
    remaining: 9,

    actualLetters: function () {
      var words = this.get('words');
      return words[Math.floor(Math.random() * words.length)].split('');
    }.property(),

    didStartGame: function () {
      var shownLetters = this.get('shownLetters');
      var actualLetters = this.get('actualLetters');

      shownLetters = actualLetters.map(function () {
        return '_';
      });

      this.set('shownLetters', shownLetters);
      this.set('badLetters', []);
    }.on('init'),

    didEnterGuess: function () {
      Ember.run.once(this, '_handleGuess');
    }.on('didEnterGuess'),

    didFinishGame: function () {
      Ember.run.once(this, '_finishGame');
    }.observes('remaining'),

    _finishGame: function () {
      if (this.get('remaining') <= 0) {
        this.set('gameOver', true);
        this.set('disabled', true);
      }
    },

    _handleGuess: function () {
      if (!this.get('currentGuess')) { return; }

      var shownLetters = this.get('shownLetters');
      var actualLetters = this.get('actualLetters');
      var badLetters = this.get('badLetters');
      var currentGuess = this.get('currentGuess');

      this._resetCurrentGuess();

      if (actualLetters.indexOf(currentGuess) !== -1) {
        actualLetters.forEach(function (_, index) {
          if (actualLetters.nextObject(index) === currentGuess) {
            shownLetters.removeAt(index);
            shownLetters.insertAt(index, currentGuess);
          }
        });
      } else {
        badLetters.pushObject(currentGuess);
        this.decrementProperty('remaining');
      }
    },

    _resetCurrentGuess: function () {
      var self = this;
      Ember.run.next(function () {
        self.set('currentGuess', null);
      });
    }
  })
});
