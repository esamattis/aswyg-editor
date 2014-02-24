
var Viewmaster = require("viewmaster");
var errorReporter = require("./errorReporter");

var Publish = Viewmaster.extend({

    template: require("./Publish.hbs"),

    initialize: function(opts) {
        this.editor = opts.editor;
        this.state = {
            public: false
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
            self.state.public = true;
            self.render();

        }, function(err) {
            errorReporter("Failed to publish")(err);
            self.$text.text("Failed to publish :(");
        });
    },

    context: function() {
        this.state.publicUrl = this.model.get("publicUrl");
        return this.state;
    },


});


module.exports = Publish;
