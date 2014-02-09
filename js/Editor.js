
var $ = require("jquery");
var _ = require("underscore");
var Viewmaster = require("viewmaster");
var CodeMirror = require("code-mirror/mode/markdown");

var CMMD = require("./CMMD");

var Editor = Viewmaster.extend({

    className: "bb-editor",

    template: require("./Editor.hbs"),

    initialize: function() {
        this.model.set("dirty", false, { silent: true });
    },

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
            tabSize: 4,
            extraKeys: {
                "Ctrl-S": self.save.bind(self)
            }
        });



        self.md = new CMMD(self.cm);

        self.on("bold", function() {
            self.md.bold();
        });

        self.on("italics", function() {
            self.md.italics();
        });

        self.on("resizeend", function() {
            self.cm.refresh();
        });

        self.model.initialized.then(function() {

            self.setContentFromModel();

            self.listenTo(self.model, "change:draft change:public", function() {
                self.setContentFromModel();
            });

            self.cm.on("change", function() {
                self.model.set("dirty", true);
            });

            self.cm.on("change", _.debounce(function() {
                self.save();
            }, 5000));

            // XXX: listenTo
            $(window).on("blur", function() {
                self.save();
            });

        });
    },

    save: function() {
        var self = this;
        if (!this.model.get("dirty")) {
            console.log("Skipping autosave. Not dirty.");
            return;
        }

        console.log("Autosaving...");
        this.model.saveDraft(this.getContent())
        .then(function() {
            self.model.set("dirty", false);
            console.log("Autosave ok!");
        }, function(err) {
            console.error("Autosave failed!", err);
        });
    },

    setContentFromModel: function() {
        this.cm.setValue(
            this.model.get("draft") || this.model.get("public") || ""
        );
    },

    getContent: function() {
        return this.cm.getValue();
    }

});

module.exports = Editor;
