
var $ = require("jquery");
var _ = require("underscore");
var Viewmaster = require("viewmaster");
var CodeMirror = require("code-mirror/mode/markdown");

var CMMD = require("./CMMD");

var Editor = Viewmaster.extend({

    className: "bb-editor",

    template: require("./Editor.hbs"),

    afterTemplate: function() {
        var self = this;

        self.cm = new CodeMirror(self.$(".editor-container").get(0), {
            // theme: require("code-mirror/theme/default"),
            theme: require("code-mirror/theme/elegant"),
            mode: "markdown",
            autofocus: true,
            indentWithTabs: false,
            smartIndent: true,
            tabMode: "spaces",

            tabSize: 4
        });

        self.md = new CMMD(self.cm);

        self.on("bold", function() {
            self.md.bold();
        });

        self.on("italics", function() {
            self.md.italics();
        });

        self.listenTo(self, "resizeend", function() {
            self.cm.refresh();
        });


        self.model.initialized.then(function() {
            self.cm.setValue(
                self.model.get("preview") || self.model.get("public") || ""
            );

            self.cm.on("change", function() {
                self.model.setDirty();
            });

            self.cm.on("change", _.debounce(function() {
                self.savePreview();
            }, 5000));

            $(window).on("blur", function() {
                self.savePreview();
            });


        });
    },

    savePreview: function() {
        this.model.savePreview(this.getContent());
    },

    getContent: function() {
        return this.cm.getValue();
    }


});

module.exports = Editor;
