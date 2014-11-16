import Game from 'hangman/services/game';

export function initialize(container, application) {
  container.register('service:game', Game, {instantiate: false});
  application.inject('route', 'game', 'service:game');
}

export default {
  name: 'game-service',
  initialize: initialize
};
