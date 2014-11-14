import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';

function runSubject(context) {
  // When instantiating this controller we're using .observes('blah').on('init')
  // which uses Ember.run.once, which requires a run loop to exist, which is not
  // the case when testing, so we create one before initializing the controller
  var controller;
  Ember.run(function () {
    controller = context.subject();
  });
  return controller;
}

moduleFor('controller:games/new', 'GamesNewController');

test('it exists', function() {
  var controller = runSubject(this);
  ok(controller);
});

test("letters - should return an array of letters given a list of random words", function() {
  var controller = runSubject(this);

  var fake_model = Ember.Object.create({
    words: ['foo']
  });

  Ember.run(function () {
    controller.set('model', fake_model);
  });

  deepEqual(controller.get('letters'), ['f', 'o', 'o']);
});
