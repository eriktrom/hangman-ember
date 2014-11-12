import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleFor('controller:games/new', 'GamesNewController', {
  // Specify the other units that are required for this test.
});

test('it exists', function() {
  var controller = this.subject();
  ok(controller);
});

test("generatedLetters - should return an array of letters given a list of random words", function() {
  var controller = this.subject();
  var fake_model = Ember.Object.create({
    words: ['foo']
  });
  controller.set('model', fake_model);
  deepEqual(controller.get('generatedLetters'), ['f', 'o', 'o']);
});
