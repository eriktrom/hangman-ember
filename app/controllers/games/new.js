import Ember from 'ember';
var run = Ember.run;

export default Ember.ObjectController.extend({
  generatedLetters: function () {
    var words = [
      'foo',
      'bar',
      'bittitan',
      'something'
    ];

    return words[Math.floor(Math.random() * words.length)].split('');
  }.property(),

  didTypeSecondLetter: function () {
    run(this, function () {
      run.once(this, '_displayError');
    });
  }.on('init').observes('currentGuess'),

  actions: {
    playLetter: function () {
      alert('Played letter');
    }
  },

  // private

    _displayError: function () {
      var currentGuess = this.get('currentGuess');
      if (currentGuess && currentGuess.length > 1) {
        this._resetInput(true);
      }
    },

    _resetInput: function (isError) {
      var msg =
        isError ? 'Only one letter please!' : this.get('placeHolderDefault');
      this.set('placeholder', msg);
      this.set('currentGuess', null);
    },
});
