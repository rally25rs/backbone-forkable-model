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

  function forkHasChanges() {
    var model1 = this._forkedFrom;
    var model2 = this;

    return _objectHasDifferences.call(this, model1, model2);
  }

  function _objectHasDifferences(obj1, obj2) {
    var i;
    var key;
    var keys1;
    var keys2;

    if(this._forkedFrom === undefined) {
      return false;
    }

    if(obj1 instanceof Backbone.Model) {
      obj1 = obj1.attributes;
    }
    if(obj2 instanceof Backbone.Model) {
      obj2 = obj2.attributes;
    }

    keys1 = _.keys(obj1);
    keys2 = _.keys(obj2);

    if(keys1.length !== keys2.length) {
      return true;
    }
    if (_.difference(keys1, keys2).length > 0) {
      return true;
    }
    if (_.difference(keys2, keys1).length > 0) {
      return true;
    }

    for(i = 0; i < keys1.length; i++) {
      key = keys1[i];
      if(typeof(obj1[key]) === 'object') {
        if(_objectHasDifferences.call(this, obj1[key], obj2[key])) {
          return true;
        }
      } else {
        if(obj1[key] !== obj2[key]) {
          return true;
        }
      }
    }

    return false;
  }

  return {
    mixin: {
      fork: fork,
      unfork: unfork,
      forkHasChanges: forkHasChanges
    }
  };
})(window._);
