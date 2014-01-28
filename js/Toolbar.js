
var $ = require("jquery");
var Viewmaster = require("viewmaster");

var Toolbar = Viewmaster.extend({

    className: "bb-toolbar",

    template: require("./Toolbar.hbs"),

    context: function() {
        return {
            buttons: [
                {
                    label: "new",
                    title: "New",
                    className: "new"
                },
                {
                    label: "open",
                    title: "Open",
                    className: "open"
                },
                {
                    label: "save",
                    title: "Draft",
                    className: "preview"
                },
                {
                    label: "publish",
                    title: "Publish",
                    className: "publish"
                },
                {
                    label: "B",
                    title: "Bold",
                    className: "bold"
                },

                {
                    label: "I",
                    title: "Italics",
                    className: "italics"
                },

                {
                    label: "link",
                    title: "Link",
                    className: "links"
                },

                {
                    label: "img",
                    title: "Image",
                    className: "image"
                },

                {
                    label: "del",
                    title: "Delete",
                    className: "delete"
                },

                {
                    label: "?",
                    title: "Help",
                    className: "help"
                }
            ]
        };
    },

    events: {
        "click button": function(e) {
            this.trigger($(e.target).data("class"), e);

        }
    }


});


module.exports = Toolbar;
