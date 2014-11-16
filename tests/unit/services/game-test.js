import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';
var run = Ember.run;

var service;

function runSubject(context) {
  return function (options) {
    var result;
    Ember.run(function () {
      result = context.subject(options || {words: ['foo']});
    });
    return result;
  };
}

var subject, service;
moduleFor('service:game', 'GameService', {
  setup: function () {
    subject = runSubject(this);
    service = subject();
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

test("disabled - is set to true when 0 remaining", function() {
  run(function () {
    service.decrementProperty('remaining', 9); // when
  });

  ok(service.get('disabled') === true);
});

test("gameOver - is set to true when 0 remaining", function() {
  run(function () {
    service.decrementProperty('remaining', 9); // when
  });

  ok(service.get('gameOver') === true);
});
