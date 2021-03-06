import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';
var run = Ember.run;

var service;
moduleFor('service:game', 'GameService', {
  setup: function () {
    var self = this;
    run(function () {
      service = self.subject({ words: ['foo'] });
    });
  }
});

test('it exists', function() {
  ok(service);
});

test("actualLetters - should return the actual letters", function() {
  var expected = ['f', 'o', 'o'];
  var actual = service.get('actualLetters');

  deepEqual(actual, expected,
    "actualLetters should eq ['f', 'o', 'o']");
});

test("shownLetters - when a new game starts", function() {
  var expected = ['_', '_', '_'];
  var actual = service.get('shownLetters');

  deepEqual(actual, expected,
    "shownLetters should eq ['_', '_', '_']");
});

test("shownLetters & badLetters - after playing a BAD guess", function() {
  run(function () {
    service.set('currentGuess', 'b'); // given
    service.trigger('didEnterGuess'); // when
  });

  // then
  deepEqual(service.get('shownLetters'), ['_', '_', '_'],
    "shownLetters should eq ['_', '_', '_']");

  deepEqual(service.get('badLetters'), ['b'],
    "badLetters should eq [b]");

  equal(service.get('remaining'), 8, 'should decrement remaining by 1');
});

test("shownLetters - after playing a GOOD guess", function() {
  run(function () {
    service.set('currentGuess', 'o'); // given
    service.trigger('didEnterGuess'); // when
  });

  // then
  deepEqual(service.get('shownLetters'), ['_', 'o', 'o'],
    "shownLetters should eq ['_', 'o', 'o']");

  deepEqual(service.get('badLetters'), [],
    "badLetters should eq []");

  equal(service.get('remaining'), 9, 'should NOT decrement remaining by 1');
});

test("state of the game when game is lost", function() {
  expect(5);

  run(function () {
    service.decrementProperty('remaining', 8); // given 8 bad guesses
    service.set('currentGuess', 'b'); // given another bad guess
    service.trigger('didEnterGuess'); // when i hit enter
  });

  // then, the state of the game should be
  equal(service.get('isWinner'), false);
  equal(service.get('isLoser'), true);
  equal(service.get('gameOver'), true);
  equal(service.get('disabled'), true);
  equal(service.get('currentGuess'), null);
});

test("state of the game when game is won", function() {
  expect(5);

  run(function () {
    service.set('currentGuess', 'f');
    service.trigger('didEnterGuess');
  });

  run(function () {
    service.set('currentGuess', 'o');
    service.trigger('didEnterGuess');
  });

  equal(service.get('isWinner'), true);
  equal(service.get('isLoser'), false);
  equal(service.get('gameOver'), true);
  equal(service.get('disabled'), true);
  equal(service.get('currentGuess'), null);
});
