/*global Aswyg */

var editor = new window.Aswyg(document.body, {

    fetchPageList: function() {
        return Aswyg.$.get("_index");
    },

    fetchPage: function(page) {
        history.pushState(page, "", "/"  + page.slug + "/_edit");
        return Aswyg.$.get("/" + page.slug + "/_json");
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
        return Aswyg.$.get("/" + page.slug + "/_json");
    },

    logout: function() {
        window.location = "/_logout";
    },

    delete: function() {
        return Aswyg.$.ajax({
            url: editor.getPublicUrl(),
            type: "DELETE",
        }).then(function() {
            window.location = "/_edit";
        });
    }

});


window.onpopstate = function() {
    // TODO: setContent
    console.log("pop state", arguments);
};

editor.setContent(window.PICO_INITIAL);
