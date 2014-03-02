
var Promise = require("bluebird");
var Backbone = require("backbone");
var _ = require("underscore");

var Content = Backbone.Model.extend({
    defaults: {
        dirty: false
    },

    initialize: function(attrs, opts) {
        var self = this;
        this.backend = opts.backend;

        self.initialized = new Promise(function(resolve) {
            self.once("change", resolve);
        });

        // Mixin the backend and ensure that it returns promises
        _.each(opts.backend, function(fn, key) {
            self[key] = function() {
                var args = [].slice.call(arguments);
                var res = Promise.cast(fn.apply(self, args));
                self.trigger.apply(self, [key, res].concat(args));
                return res;
            };
        });

        this.on("saveDraft", function(p, content) {
            var self = this;
            p.then(function() {
                self.set({
                    dirty: false,
                    draft: content
                });
            });
        });

        this.on("publish", function(p, content) {
            var self = this;
            p.then(function() {
                self.set({
                    "public": content,
                    dirty: false,
                    draft: null
                });
            });
        });

    },

    hasUnpublishedChanges: function() {
        if (this.get("dirty")) return true;
        if (!this.get("draft")) return false;
        return this.get("draft") !== this.get("public");
    },


    reset: function(data) {
        var self = this;
        data = Promise.cast(data);

        var done =  data.then(function(data) {
            self.clear({ silent: true });
            self.set(data);
        });

        this.trigger("resetStart", done);

        return done;
    }


});


module.exports = Content;
