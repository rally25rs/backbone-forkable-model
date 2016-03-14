# backbone-forkable-model
Extend Backbone.js models to make them forkable from another model, and later able to be merged back to the original.

## Use Case

The original use case for this was that I had a lot of UI views that let users edit models in a modal window (popup editor form).

The modal dialog would always have "Cancel" and "Save" buttons.

On close, I would need to revert the model back to its original state. We got in the habbit of passing a `.clone()` of the model into the editor window as the Model instead of the "real" copy of the model that was loaded from the server. Then when "cancel" was clicked, no action had to be taken. The cloned copy of the model that the editor was using could just be discarded. On "save", the cloned (edited) model's attributes could be copied back tot he "main" copy with a simple `original.set(cloned.attributes);`

In spirit, that is what this model mixin provides.

## Installation

(not yet published to NPM and Bower. It is on my todo list!)

Add to page scripts after `backbone.js`.

This library does not support Require.js or Browserify at this time (in other words, it is not written as a module).

## Usage / API

This mixin attaches itself to the global `Backbone` object as `Backbone.ForkableModel`.

Extend a Backbone model (or [backbone-deep-model](https://github.com/powmedia/backbone-deep-model)):

```
var MyModel = Backbone.Model.extend(Backbone.ForkableModel.mixin).extend({
    yourCustomStuff: function() {},
    goesInHere: function() {}
});
```

You can chain `.extend()` calls to add more mixins. For example I typically use DeepModel and the [Backbone.Validation](https://github.com/thedersen/backbone.validation) library:

```
var MyModel = Backbone.DeepModel
    .extend(Backbone.ForkableModel.mixin)
    .extend(Backbone.Validation.mixin)
    .extend({

    yourCustomStuff: function() {},
    goesInHere: function() {}
});
```

The `ForkableModel.mixin` adds these functions to instances of the model:

### .fork()

Returns a new instance of the model wil all attributes copied tot he new instance. This is bascially the same as `Model.clone();`

### .unfork()

Sets the attributes of the instance of the model that was originally forked to match this forked copy (Copies property values back to the original).

This is done using `Model.set()` and `Model.unset()` functions internally, so all events will be triggered on the model instance as if `.set()` was called normally.

Returns the instance of the model that was orignally forked from.

## Sample Code

```
Marionette.ItemView.extend({
    events: {
        'click #editButton': 'onEdit'
    },

    // When the user wants to edit this item, an edit form is opened.
    onEdit: function() {
        var editDialog = new EditDialogView({
            model: this.model.fork()
        });

        // the EditDialogView triggers a "save" event when the user clicks the save button
        this.listenTo(editDialog, 'save', function(editedModel) {
            var originalModel = editedModel.unfork();

            // originalModel is the same instance as "this.model" that .fork() was called on.

            originalModel.save().done(function() {
                // notify user of successful save
            }).fail(function() {
                // notify user of error
            });
        });

        editDialog.show();
    }
});
```
