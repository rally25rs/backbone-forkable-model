'use strict';

var TestModel = Backbone.Model.extend(Backbone.ForkableModelMixin);

describe('fork()', function() {
  var fixture;

  beforeEach(function() {
    fixture = {
      modelWithOneProperty: new TestModel({
        one: 1
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
});
