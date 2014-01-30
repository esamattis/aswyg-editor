
var SplitEdit = require("./SplitEdit");
var _ = require("underscore");
var request = require("./request");

function init(opts) {
    var Content = require("./Content");
    var content = new Content({}, opts);

    var sv = new SplitEdit(_.extend({}, opts, {
        model: content,
    }));

    sv.render();

    content.fetch();
}


init({
    el: document.body,
    adapter: {
        fetchPages: function() {
            return request.get("/pages.json");
        },

        savePreview: function(content) {
            return request.post(window.location.pathname, {
                type: "preview",
                value: content
            });
        },

        savePublic: function(content) {
            return request.post(window.location.pathname, {
                type: "public",
                value: content
            });
        },

        // XXX
        new: function(title, url) {
            window.localStorage.presetTitle = title;
            window.location = url;
        },

        // XXX
        open: function(title, url) {
            window.location = url;
        },

        fetch: function() {
            var url = window.location.pathname + "?show=json";
            var previewUrl = window.location.pathname + "?show=preview";

            return request.get(url).then(function(data) {
                var title = window.localStorage.presetTitle || "Page Title";
                if (!data.public && !data.preview) {
                    data.preview = "/*\nTitle: " + title + "\n*/\n\nContent.\n";
                    delete window.localStorage.presetTitle;
                }

                data.previewUrl = previewUrl;
                return data;

            });
        }
    }

});

