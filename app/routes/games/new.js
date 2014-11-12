import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.createRecord('game');
  },

  deactivate: function () {
    this.model.destroyRecord();
  },

  actions: {
    newGame: function () {
      this.refresh();
    }
  }

});
