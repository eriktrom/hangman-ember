import Ember from 'ember';
import startApp from '../helpers/start-app';

import Game from 'hangman/services/game';
Game.reopen({ words: ['foo'] });

function $findShownLetters() {
  return $('#shownLetters li');
}

function $assertContains(text) {
  var result = find('#game-board:contains('+text+')').length;
  if (result === 1) { return true; } else { return false; }
}

function $findMissedLetter(n) {
  var selector = '#missedLetters > li:nth-child('+n+')';
  return $(selector).text();
}

function $findShownLetter(n) {
  var selector = '#shownLetters > li:nth-child('+n+')';
  return find(selector).text();
}

function $assertRemainingCount(count) {
  var selector = '#remaining:contains('+count+')';
  var result = $(selector).length;
  if (result === 1) { return true; } else { return false; }
}

function $enterLetter(letter) {
  fillIn('#game-board .ember-text-field', letter);
  triggerEvent('#game-board form', 'submit');
}

var App;

module('Acceptance: PlayGame', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

var _route = '/';
test('visiting /', function() {
  visit(_route);

  andThen(function() {
    equal(currentPath(), 'index');
  });
});

test("The board should be empty when starting a new game", function() {
  visit(_route);

  andThen(function () {
    equal($findShownLetters().length, 3);
    equal($findShownLetter(1), '_');
    equal($findShownLetter(2), '_');
    equal($findShownLetter(3), '_');
  });
});

test("Playing a GOOD letter", function() {
  visit(_route);
  $enterLetter('f');

  andThen(function () {
    equal($findShownLetters().length, 3);
    equal($findShownLetter(1), 'f');
    equal($findShownLetter(2), '_');
    equal($findShownLetter(3), '_');
  });
});

test("Playing a BAD letter", function() {
  visit(_route);
  $enterLetter('b');

  andThen(function () {
    equal($findShownLetters().length, 3);
    equal($findShownLetter(1), '_');
    equal($findShownLetter(2), '_');
    equal($findShownLetter(3), '_');

    equal($assertRemainingCount(8), true);
    equal($findMissedLetter(1), 'b');
  });
});

test("Losing a game", function() {
  visit(_route);
  $enterLetter('1');
  $enterLetter('2');
  $enterLetter('3');
  $enterLetter('4');
  $enterLetter('5');
  $enterLetter('6');
  $enterLetter('7');
  $enterLetter('8');
  $enterLetter('9');

  andThen(function () {
    equal($assertContains('Game Over'), true);
    equal($assertContains('Play Again'), true);
    equal($assertContains('You Lost!'), true);
    equal($assertRemainingCount(0), true);
    equal($findMissedLetter(4), '4');
    equal($findMissedLetter(9), '9');
  });
});

test("Winning a game", function() {
  visit(_route);
  $enterLetter('f');
  $enterLetter('o');

  andThen(function () {
    equal($assertContains('Game Over'), true);
    equal($assertContains('Play Again'), true);
    equal($assertContains('You Won!'), true);
    equal($assertRemainingCount(9), true);
  });
});

test("A new game refreshes the game board", function() {
  visit(_route);
  $enterLetter('1');
  $enterLetter('f');

  andThen(function () {
    equal($assertRemainingCount(8), true);
    equal($findMissedLetter(1), '1');
    equal($findShownLetter(1), 'f');

    click('#new-game');
  });

  andThen(function () {
    equal($assertRemainingCount(9), true);
    equal($findMissedLetter(1), '');
    equal($findShownLetter(1), '_');
  });
});
