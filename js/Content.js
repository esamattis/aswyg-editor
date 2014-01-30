

var Promise = require("bluebird");
var Backbone = require("backbone");
var request = require("./request");


var Content = Backbone.Model.extend({

    defaults: {
        dirty: true,
        dirtyPreview: true,
    },

    initialize: function(attrs, opts) {
        var self = this;
        this.adapter = opts.adapter;

        self.initialized = new Promise(function(resolve) {
            self.once("change", resolve);
        });

    },

    setDirty: function() {
        this.set({
            dirty: true,
            dirtyPreview: true,
        });
    },


    savePreview: function(content) {
        var self = this;
        if (!self.get("dirtyPreview")) {
            console.log("Preview not dirty");
            return;
        }

        if (!content || !content.trim()) {
            console.warn("Not saving empty content");
            return;
        }

        var p = this.adapter.savePreview(content).then(function() {
            self.set("dirtyPreview", false);
            self.set("preview", content);
        });

        self.trigger("savePreview", p);
        return p;
    },

    savePublic: function(content) {
        var self = this;
        if (!self.get("dirty")) {
            console.log("Not dirty");
            return;
        }

        if (!content || !content.trim()) {
            console.warn("Not saving empty content");
            return;
        }

        var p = this.adapter.savePublic(content).then(function() {
            self.set("dirty", false);
            self.set("public", content);
        });

        self.trigger("savePublic", p);
        return p;
    },

    fetch: function() {
        var self = this;
        return self.adapter.fetch().then(function(data) {
            self.set(data);
        });
    }

});


module.exports = Content;
