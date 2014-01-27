

var Promise = require("bluebird");
var Backbone = require("backbone");
var request = require("./request");


var Content = Backbone.Model.extend({

    url: window.location.pathname + "?show=json",

    defaults: {
        dirty: true,
        dirtyPreview: true,
    },

    initialize: function() {
        var self = this;

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


        var p = request.post(window.location.pathname, {
            type: "preview",
            value: content
        }).then(function() {
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

        var p = request.post(window.location.pathname, {
            type: "public",
            value: content
        }).then(function() {
            self.set("dirty", false);
            self.set("public", content);
        });

        self.trigger("savePublic", p);
        return p;
    },

    fetch: function() {
        var self = this;
        return request.get(this.url).then(function(data) {

            var title = window.localStorage.presetTitle || "Page Title";
            if (!data.public && !data.preview) {
                data.preview = "/*\nTitle: " + title + "\n*/\n\nContent.\n";
                delete window.localStorage.presetTitle;
            }

            self.set(data);
        });
    }


});


module.exports = Content;
