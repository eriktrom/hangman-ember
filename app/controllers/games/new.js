import Ember from 'ember';
var run = Ember.run;

export default Ember.ObjectController.extend({
  letters: function () {
    var words = this.get('words');
    return words[Math.floor(Math.random() * words.length)].split('');
  }.property(),

  didTypeLetter: function () {
    run.once(this, '_displayError');
  }.on('init').observes('currentGuess'),

  actions: {
    playLetter: function () {
      alert('Played letter');
    }
  },

  // private

  _displayError: function () {
    if (this.get('currentGuess') && this.get('currentGuess').length > 1) {
      this.set('placeholder',
        this.getWithDefault('placeHolderDefault', 'Only one letter please!'));
      this.set('currentGuess', null);
    }
  }
});
