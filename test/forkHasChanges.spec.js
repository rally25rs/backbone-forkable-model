'use strict';

var TestModel = Backbone.Model.extend(Backbone.ForkableModel.mixin);
var TestDeepModel = Backbone.DeepModel.extend(Backbone.ForkableModel.mixin);

describe('forkHasChanges()', function() {
  var fixture;

  beforeEach(function() {
    fixture = {
      modelWithOneProperty: new TestModel({
        one: 1
      }),
      deepModelWithNestedObject: new TestDeepModel({
        one: 1,
        sub: {
          prop: 'x'
        }
      })
    };
  });

  it('returns false when called on a model that wasnt forked from another model', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();

    forked.set('one', 'changed');

    expect(original.forkHasChanges()).to.be.false;
  });

  it('returns false when no changes have been made', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();

    expect(forked.forkHasChanges()).to.be.false;
  });


  it('returns false when value is set to same original value', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();
    forked.set('one', 1);

    expect(forked.forkHasChanges()).to.be.false;
  });

  it('returns true when value is changed', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();
    forked.set('one', 2);

    expect(forked.forkHasChanges()).to.be.true;
  });


  it('returns true when value is added', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();
    forked.set('two', 2);

    expect(forked.forkHasChanges()).to.be.true;
  });

  it('returns true when value is removed', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();
    forked.unset('one');

    expect(forked.forkHasChanges()).to.be.true;
  });

  describe('with DeepModel', function() {
    it('returns false when no changes have been made to sub model', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();

      expect(forked.forkHasChanges()).to.be.false;
    });


    it('returns false when sub model value is set to same original value', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();
      forked.set('sub.prop', 'x');

      expect(forked.forkHasChanges()).to.be.false;
    });

    it('returns true when value is changed on sub model', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();
      forked.set('sub.prop', 'changed');

      expect(forked.forkHasChanges()).to.be.true;
    });


    it('returns true when value is added to sub model', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();
      forked.set('sub.proptwo', 2);

      expect(forked.forkHasChanges()).to.be.true;
    });

    it('returns true when value is removed from sub model', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();
      forked.unset('sub.prop');

      expect(forked.forkHasChanges()).to.be.true;
    });
  });
});
