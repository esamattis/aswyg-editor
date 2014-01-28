
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
                    liClass: "new",
                    buttonClass: "new fa fa-file"
                },
                {
                    title: "Open",
                    liClass: "open",
                    buttonClass: "fa fa-folder-open"
                },
                {
                    title: "Save draft",
                    liClass: "save-draft",
                    buttonClass: "save fa fa-save"
                },

                {
                    title: "Publish",
                    liClass: "publish",
                    buttonClass: "fa fa-cloud-upload"
                },

                {
                    title: "Preview in external window",
                    liClass: "preview",
                    buttonClass: "fa fa-share-square-o"
                },

                {
                    title: "Delete",
                    liClass: "delete",
                    buttonClass: "fa fa-trash-o"
                },

                {
                    label: "H1",
                    title: "Heading 1",
                    liClass: "heading1",
                },

                {
                    label: "H2",
                    title: "Heading 2",
                    liClass: "heading2",
                },

                {
                    label: "H3",
                    title: "Heading 3",
                    liClass: "heading3",
                },

                {
                    title: "Bold",
                    liClass: "bold",
                    buttonClass: "fa fa-bold"
                },

                {
                    title: "Italics",
                    liClass: "italics",
                    buttonClass: "fa fa-italic"
                },

                {
                    title: "Strikethrough",
                    liClass: "strikethrough",
                    buttonClass: "fa fa-strikethrough"
                },

                {
                    title: "List",
                    liClass: "list",
                    buttonClass: "fa fa-list"
                },

                {
                    title: "Numbered list",
                    liClass: "list",
                    buttonClass: "fa fa-list-ol"
                },

                {
                    title: "Table",
                    liClass: "table",
                    buttonClass: "fa fa-table"
                },

                {
                    title: "Link",
                    liClass: "links",
                    buttonClass: "fa fa-link"
                },

                {
                    title: "Image",
                    liClass: "image",
                    buttonClass: "fa fa-camera"
                },


                {
                    title: "Help",
                    liClass: "help",
                    buttonClass: "fa fa-question"
                },

                {
                    title: "Logout",
                    liClass: "logout",
                    buttonClass: "fa fa-sign-out"
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
