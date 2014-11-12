import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  remainingGuesses: DS.attr('number', {defaultValue: 9}),
  placeholderDefault: DS.attr('string', {defaultValue: 'Guess a letter'}),

  // this is an odd model, but all state defined here is transient, mutable
  // objects, like controllers are bad. Perhaps this can go in a component later
  currentGuess: null,
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
