export function initialize(container, application) {
  application.inject('route', 'gameService', 'service:game');
}

export default {
  name: 'game-service',
  initialize: initialize
};
