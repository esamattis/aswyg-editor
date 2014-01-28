
var $ = require("jquery");
var Viewmaster = require("viewmaster");

var Toolbar = Viewmaster.extend({

    className: "bb-toolbar",

    template: require("./Toolbar.hbs"),

    context: function() {
        return {
            buttons: [
                {
                    title: "Help",
                    className: "help fa fa-question"
                },

                {
                    title: "New",
                    className: "new fa fa-file"
                },
                {
                    title: "Open",
                    className: "open fa fa-folder-open"
                },
                {
                    title: "Save draft",
                    className: "preview save fa fa-save"
                },
                {
                    title: "Publish",
                    className: "publish fa fa-cloud-upload"
                },
                {
                    label: "B",
                    title: "Bold",
                    className: "bold"
                },

                {
                    title: "Italics",
                    className: "italics fa fa-italic"
                },

                {
                    title: "List",
                    className: "list fa fa-list"
                },

                {
                    title: "Numbered list",
                    className: "list fa fa-list-ol"
                },

                {
                    title: "Link",
                    className: "links fa fa-link"
                },

                {
                    title: "Image",
                    className: "image fa fa-camera"
                },

                {
                    title: "Delete",
                    className: "delete fa fa-trash-o"
                },

                {
                    title: "Logout",
                    className: "open fa fa-sign-out"
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
