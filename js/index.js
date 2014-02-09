var Aswyg = require("./Aswyg");

function ensureDefaultContent(data) {
    return Aswyg.Promise.cast(data).then(function(data) {
        var current = data.draft || data.public;
        if (!current) {
            data.draft = [
                "/*\nTitle: Page Title\n*/",
                "First paragraph.",
                "## Second header",
                "Second paragraph"
            ].join("\n\n");
        }
        return data;
    });
}

var editor = new Aswyg(document.body, {

    fetchPageList: function() {
        return Aswyg.$.get("_index");
    },

    fetchPage: function(page) {
        history.pushState(page, "", "/"  + page.slug + "/_edit");
        return ensureDefaultContent(Aswyg.$.get("/" + page.slug + "/_json"));
    },

    saveDraft: function(content) {
        return Aswyg.$.ajax({
            url: editor.getDraftUrl(),
            type: "PUT",
            data: content
        });
    },

    publish: function(content) {
        return Aswyg.$.ajax({
            url: editor.getPublicUrl(),
            type: "PUT",
            data: content
        });
    },

    createNew: function(page) {
        history.pushState(page, "", "/"  + page.slug + "/_edit");
        return ensureDefaultContent(Aswyg.$.get("/" + page.slug + "/_json"));
    },

    logout: function() {
        window.location = "/logout";
    },

    delete: function() {
        return Aswyg.$.ajax({
            url: editor.getPublicUrl(),
            type: "DELETE",
        }).then(function() {
            window.location = "/_edit";
        }, function(err) {
            console.error("Failed to delete this page", err);
        });
    }

});


window.onpopstate = function() {
    // TODO: setContent
    console.log("pop state", arguments);
};

editor.setContent(ensureDefaultContent(window.PICO_INITIAL));
