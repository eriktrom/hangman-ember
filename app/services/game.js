import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
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
});
