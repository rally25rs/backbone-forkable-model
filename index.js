Backbone.ForkableModel = (function(_) {
  'use strict';

  function fork() {
    var clone = this.clone();
    clone._forkedFrom = this;
    return clone;
  }

  function unfork() {
    this._forkedFrom.set(this.attributes);
    return this._forkedFrom;
  }

  return {
    mixin: {
      fork: fork,
      unfork: unfork
    }
  };
})(window._);
