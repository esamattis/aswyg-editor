
var Viewmaster = require("viewmaster");
var errorReporter = require("./errorReporter");
var _ = require("underscore");

var Publish = Viewmaster.extend({

    template: require("./Publish.hbs"),

    initialize: function(opts) {
        this.editor = opts.editor;
        this.state = {
            publishDone: false,
            unpublishedChanges: this.model.hasUnpublishedChanges()
        };
    },

    events: {
        "click .publish": "publish"
    },

    afterTemplate: function() {
        this.$text = this.$(".content");
    },

    publish: function() {
        var self = this;
        self.$text.text("Working...");

        self.model.publish(self.editor.getContent()).then(function() {
            self.state.publishDone = true;
            self.render();
        }).catch(function(err) {
            errorReporter("Failed to publish")(err);
            self.$text.text("Failed to publish :(");
        });
    },

    context: function() {
        return _.extend({}, this.model.toJSON(), this.state);
    },


});


module.exports = Publish;
