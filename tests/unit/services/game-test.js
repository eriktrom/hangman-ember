import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';
var run = Ember.run;

var service;

function currySubject(context) {
  return function (_options) {
    var options = _options || {words: ['foo']}, result;
    Ember.run(function () {
      result = context.subject().game.create(options);
    });
    return result;
  };
}

var subject;
moduleFor('service:game', 'GameService', {
  setup: function () {
    subject = currySubject(this);
  }
});

test('it exists', function() {
  var service = subject();

  ok(service);
});

test("actualLetters - should return the actual letters", function() {
  var service = subject();

  var expected = ['f', 'o', 'o'];
  var actual = service.get('actualLetters');

  deepEqual(actual, expected,
    "actualLetters should eq ['f', 'o', 'o']");
});

test("shownLetters - when a new game starts", function() {
  var service = subject();

  var expected = ['_', '_', '_'];
  var actual = service.get('shownLetters');

  deepEqual(actual, expected,
    "shownLetters should eq ['_', '_', '_']");
});

test("shownLetters & badLetters - after playing a BAD guess", function() {
  var service = subject();

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
  var service = subject();

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

test("disabled - is set to true when 0 remaining", function() {
  var service = subject();

  run(function () {
    service.decrementProperty('remaining', 9); // when
  });

  ok(service.get('disabled') === true);
});

test("gameOver - is set to true when 0 remaining", function() {
  var service = subject();

  run(function () {
    service.decrementProperty('remaining', 9); // when
  });

  ok(service.get('gameOver') === true);
});
