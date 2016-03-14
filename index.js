Backbone.ForkableModelMixin = (function(_) {
  'use strict';

  function fork() {
    return this.clone();
  }

  return {
    fork: fork
  };
})(window._);
