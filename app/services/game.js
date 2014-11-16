import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  words: [
    'foo',
    'bar',
    'bittitan',
    'something'
  ],
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
    Ember.run.once(this, '_handleFinish');
  }.on('didEnterGuess'),

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
  },

  _handleFinish: function () {
    var isLoser = this.get('remaining') <= 0;
    var isWinner = !this.get('shownLetters').contains('_');
    var isFinished = isLoser || isWinner;

    if (isFinished) {
      this.setProperties({
        gameOver: true,
        disabled: true
      });
    }

    if (isLoser) {
      this.set('isLoser', true);
    }

    if (isWinner) {
      this.set('isWinner', true);
    }
  }
});
