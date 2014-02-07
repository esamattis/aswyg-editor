
var $ = require("jquery");
var Viewmaster = require("viewmaster");

var Toolbar = Viewmaster.extend({

    className: "bb-toolbar",

    template: require("./Toolbar.hbs"),

    context: function() {
        return {
            buttons: [
                {
                    title: "New",
                    action: "new",
                    buttonClass: "new fa fa-file"
                },
                {
                    title: "Open",
                    action: "open",
                    buttonClass: "fa fa-folder-open"
                },
                {
                    title: "Save draft",
                    action: "saveDraft",
                    buttonClass: "fa fa-save"
                },

                {
                    title: "Publish",
                    action: "publish",
                    buttonClass: "fa fa-cloud-upload"
                },

                {
                    title: "Preview in external window",
                    action: "preview",
                    buttonClass: "fa fa-share-square-o"
                },

                {
                    title: "Delete",
                    action: "delete",
                    buttonClass: "fa fa-trash-o"
                },

                {
                    label: "H1",
                    title: "Heading 1",
                    action: "heading1",
                },

                {
                    label: "H2",
                    title: "Heading 2",
                    action: "heading2",
                },

                {
                    label: "H3",
                    title: "Heading 3",
                    action: "heading3",
                },

                {
                    title: "Bold",
                    action: "bold",
                    buttonClass: "fa fa-bold"
                },

                {
                    title: "Italics",
                    action: "italics",
                    buttonClass: "fa fa-italic"
                },

                {
                    title: "Strikethrough",
                    action: "strikethrough",
                    buttonClass: "fa fa-strikethrough"
                },

                {
                    title: "List",
                    action: "list",
                    buttonClass: "fa fa-list"
                },

                {
                    title: "Numbered list",
                    action: "list",
                    buttonClass: "fa fa-list-ol"
                },

                {
                    title: "Table",
                    action: "table",
                    buttonClass: "fa fa-table"
                },

                {
                    title: "Link",
                    action: "links",
                    buttonClass: "fa fa-link"
                },

                {
                    title: "Image",
                    action: "image",
                    buttonClass: "fa fa-camera"
                },


                {
                    title: "Help",
                    action: "help",
                    buttonClass: "fa fa-question"
                },

                {
                    title: "Logout",
                    action: "logout",
                    buttonClass: "fa fa-sign-out"
                }

            ]
        };
    },

    events: {
        "click button": function(e) {
            this.trigger($(e.target).data("action"), e);

        }
    }


});


module.exports = Toolbar;
