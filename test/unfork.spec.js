'use strict';

var TestModel = Backbone.Model.extend(Backbone.ForkableModel.mixin);
var TestDeepModel = Backbone.DeepModel.extend(Backbone.ForkableModel.mixin);

describe('unfork()', function() {
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

  it('function is added to Backbone.Model instances', function() {
    var original = fixture.modelWithOneProperty;

    expect(original.unfork).to.exist;
  });

  it('returns the instance of the model it was forked from', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();
    var result = forked.unfork();

    expect(result).to.equal(original);
  });

  it('sets changed values on model it was forked from', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();

    forked.set('one', 2);
    forked.unfork();

    expect(original.get('one')).to.equal(2);
  });

  it('sets newly added values on model it was forked from', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();

    forked.set('two', 2);
    forked.unfork();

    expect(original.get('two')).to.equal(2);
  });

  it('triggers change events on model it was forked from', function(done) {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();
    original.once('change:one', function() {
      done();
    });

    forked.set('one', 2);
    forked.unfork();
  });

  describe('with DeepModel', function() {
    it('sets changed values on nested obejcts', function() {
      var original = fixture.modelWithOneProperty;
      var forked = original.fork();

      forked.set('sub.prop', 'changed');
      forked.unfork();

      expect(original.get('sub.prop')).to.equal('changed');
    });

    it('preserves instance of sub objects', function() {
      var original = fixture.modelWithOneProperty;
      var originalSub = original.get('sub');
      var forked = original.fork();

      forked.set('sub.prop', 'changed');
      forked.unfork();

      expect(original.get('sub')).to.equal(originalSub);
    });

    it('triggers change events for sub objects on model it was forked from', function(done) {
      var original = fixture.modelWithOneProperty;
      var forked = original.fork();
      original.once('change:sub.prop', function() {
        done();
      });

      forked.set('sub.prop', 'changed');
      forked.unfork();
    });
  });
});
