import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: PlayNewGame', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /games/new', function() {
  visit('/games/new');

  andThen(function() {
    equal(currentPath(), 'games.new');
  });
});



test('only 1 character may be entered into the guess letter field', function () {
  expect(2);

  function $input() {
    return find('input', '#game-board');
  }

  visit('/games/new');
  andThen(function () {
    equal($input().attr('placeholder'), 'Guess a letter');
  });

  fillIn($input(), 'aa');
  andThen(function () {
    equal($input().attr('placeholder'), 'Only one letter please!');
  });
});
