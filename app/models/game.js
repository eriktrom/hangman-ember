import DS from 'ember-data';
import Ember from 'ember';

// TODO: move to controller, assuming I find a way to reset them :)
export default DS.Model.extend({
  currentGuess: null,
  remainingGuesses: 9,
  placeholderDefault: 'Guess a letter',
  placeholder: Ember.computed.reads('placeholderDefault'),
  missedLetters: Ember.A(),
  foundLetters: Ember.A(),
  words: [
    'foo',
    'bar',
    'bittitan',
    'something'
  ]
});
