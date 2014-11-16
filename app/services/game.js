import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  disabled: false,
  gameOver: false,
  isWinner: false,
  isLoser: false,
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
  }.observes('remaining', 'shownLetters.[]'),

  _finishGame: function () {
    var isLoser = this.get('remaining') <= 0;
    if (isLoser) {
      this.set('gameOver', true);
      this.set('disabled', true);
      this.set('isLoser', true);
    }

    var isWinner = !this.get('shownLetters').contains('_');
    if (isWinner) {
      this.set('gameOver', true);
      this.set('disabled', true);
      this.set('isWinner', true);
    }
  },

  _handleGuess: function () {
    if (!this.get('currentGuess')) { return; }

    var shownLetters = this.get('shownLetters');
    var actualLetters = this.get('actualLetters');
    var badLetters = this.get('badLetters');
    var currentGuess = this.get('currentGuess');

    this.set('currentGuess', null);

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
  }
});
