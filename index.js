Backbone.ForkableModel = (function(_) {
  'use strict';

  function fork() {
    var clone = this.clone();
    clone._forkedFrom = this;
    return clone;
  }

  function unfork() {
    var forkedFrom = this._forkedFrom;
    var removedKeys = _.difference(forkedFrom.keys(), this.keys());
    var unsetProps = {};

    _.each(removedKeys, function(key) {
      unsetProps[key] = undefined;
    });

    forkedFrom.set(this.attributes);
    forkedFrom.unset(unsetProps);

    return this._forkedFrom;
  }

  return {
    mixin: {
      fork: fork,
      unfork: unfork
    }
  };
})(window._);
