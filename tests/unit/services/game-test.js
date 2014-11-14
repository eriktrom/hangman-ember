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
    Ember.run(function () {
      service = self.subject().game.create({words: ['foo']});
    });
  },
  teardown: function () {
    Ember.run(function () {
      service.destroy();
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
    service.decrementProperty('remaining'); // when
  });

  // then
  deepEqual(service.get('shownLetters'), ['_', '_', '_'],
    "shownLetters should eq ['_', '_', '_']");

  deepEqual(service.get('badLetters'), ['b'],
    "badLetters should eq [b]");
});

test("shownLetters - after playing a GOOD guess", function() {
  run(function () {
    service.set('currentGuess', 'f'); // given
    service.decrementProperty('remaining'); // when
  });

  // then
  deepEqual(service.get('shownLetters'), ['f', '_', '_'],
    "shownLetters should eq ['f', '_', '_']");

  deepEqual(service.get('badLetters'), [],
    "badLetters should eq []");
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
