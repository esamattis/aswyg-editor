
var $ = require("jquery");
var Viewmaster = require("viewmaster");
var Dropdown = require("./Dropdown");

var Toolbar = Viewmaster.extend({

    className: "bb-toolbar",

    template: require("./Toolbar.hbs"),

    context: function() {
        return {
            buttons: [
                {
                    title: "New",
                    className: "new"
                },
                {
                    title: "Open",
                    className: "open"
                },
                {
                    title: "Preview",
                    className: "preview"
                },
                {
                    title: "Publish",
                    className: "publish"
                },
                {
                    title: "Bold",
                    className: "bold"
                },

                {
                    title: "Italics",
                    className: "italics"
                },

                {
                    title: "Link",
                    className: "links"
                },

                {
                    title: "Image",
                    className: "image"
                },

                {
                    title: "Delete",
                    className: "delete"
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
