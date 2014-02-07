var Aswyg = require("./Aswyg");
var request = require("./request");

function defaultContent(title) {
    return "/*\nTitle: " + title + "\n*/\n\nContent.\n";
}

var editor = new Aswyg(document.body, {

    fetchPageList: function() {
        return request.get("/pages.json");
    },

    fetchPage: function(page) {
        window.location = "/" + page.url + "?show=editor";
    },

    saveDraft: function(content) {
        return request.post(window.location.pathname, {
            type: "preview",
            value: content
        });
    },

    publish: function(content) {
        return request.post(window.location.pathname, {
            type: "public",
            value: content
        });
    },

    createNew: function(page) {
        window.localStorage.presetTitle = page.title;
        window.location = "/" + url.slug + "?show=editor";
    },

    logout: function() {
        window.location = "/logout";
    },

    delete: function() {

    }

});


var url = window.location.pathname + "?show=json";
var previewUrl = window.location.pathname + "?show=preview";

editor.setContent(request.get(url).then(function(data) {
    var title = window.localStorage.presetTitle || "Page Title";
    if (!data.public && !data.preview) {
        data.preview = defaultContent(title);
        delete window.localStorage.presetTitle;
    }

    data.previewUrl = previewUrl;
    return data;
}));
