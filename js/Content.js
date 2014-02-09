
var Promise = require("bluebird");
var Backbone = require("backbone");
var _ = require("underscore");

var Content = Backbone.Model.extend({

    initialize: function(attrs, opts) {
        var self = this;
        this.backend = opts.backend;

        self.initialized = new Promise(function(resolve) {
            self.once("change", resolve);
        });

        // Mixin the backend and ensure that it returns promises
        _.each(opts.backend, function(fn, key) {
            self[key] = function() {
                var res = Promise.cast(fn.apply(self, arguments));
                self.trigger(key, res);
                return res;
            };
        });

    },

    reset: function(data) {
        var self = this;
        data = Promise.cast(data);
        this.trigger("resetStart", data);
        return data.then(function(data) {
            console.log("Loading", data);
            self.clear({ silent: true });
            self.set(data);
        }, function(err) {
            console.error("Failed to content", err, err && err.responseText);
            throw err;
        });
    },

    fetch: function() {
        throw new Error("fetch not in use");
    }

});


module.exports = Content;
