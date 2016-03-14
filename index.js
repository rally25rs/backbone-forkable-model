Backbone.ForkableModel = (function(_) {
  'use strict';

  function fork() {
    return this.clone();
  }

  return {
    mixin: {
      fork: fork
    }
  };
})(window._);
