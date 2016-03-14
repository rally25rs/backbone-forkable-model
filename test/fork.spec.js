'use strict';

var TestModel = Backbone.Model.extend(Backbone.ForkableModel.mixin);
var TestDeepModel = Backbone.DeepModel.extend(Backbone.ForkableModel.mixin);

describe('fork()', function() {
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

    expect(original.fork).to.exist;
  });

  it('returns a new model instance', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();

    expect(forked).is.not.equal(original);
    expect(forked).is.instanceof(Backbone.Model);
  });

  it('returns a model with the same attributes as the original', function() {
    var original = fixture.modelWithOneProperty;
    var forked = original.fork();

    expect(forked.toJSON()).to.deep.equal(original.toJSON());
  });

  describe('with a DeepModel', function() {
    it('returns a model with the same nested attributes as the original', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();

      expect(forked.toJSON()).to.deep.equal(original.toJSON());
    });

    it('returns a model with copies of nested objects', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();

      expect(forked.get('sub')).not.to.equal(original.get('sub'));
    });

    it('changing an attribute on the fork does not affect the original', function() {
      var original = fixture.deepModelWithNestedObject;
      var forked = original.fork();

      forked.set('sub.prop', 'changed');

      expect(original.get('sub.prop')).to.equal('x');
      expect(forked.get('sub.prop')).to.equal('changed');
    });
  });
});
