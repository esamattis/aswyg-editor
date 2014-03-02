
var $ = require("jquery");
var _ = require("underscore");
var Viewmaster = require("viewmaster");
var CodeMirror = require("code-mirror/mode/markdown");
var errorReporter = require("./errorReporter");

var CMMD = require("./CMMD");

var Editor = Viewmaster.extend({

    className: "bb-editor",

    template: require("./Editor.hbs"),

    initialize: function() {

        var self = this;

        this.bindAutoSaving = _.once(this.bindAutoSaving);
        this.listenTo(this.model, "resetStart", function(p) {
            p.then(function() {
                self.setContentFromModel();
                self.bindAutoSaving();
            });
        });

    },

    afterTemplate: function() {
        var self = this;

        self.cm = new CodeMirror(self.$(".editor-container").get(0), {
            // theme: require("code-mirror/theme/default"),
            theme: require("code-mirror/theme/elegant"),
            mode: "markdown",
            lineWrapping: true,
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

        self.on("heading1", function() {
            self.md.heading1();
        });

        self.on("heading2", function() {
            self.md.heading2();
        });

        self.on("heading3", function() {
            self.md.heading3();
        });

        self.on("ul", function() {
            self.md.ul();
        });

        self.on("ol", function() {
            self.md.ol();
        });

        self.on("table", function() {
            self.md.table();
        });

        self.on("link", function() {
            self.md.link();
        });

        self.on("image", function() {
            self.md.image();
        });


        self.on("resizeend", function() {
            self.cm.refresh();
        });

    },

    bindAutoSaving: function() {
        var self = this;
        self.cm.on("change", function() {
            self.model.set("dirty", true);
        });

        self.cm.on("change", _.debounce(function() {
            self.save();
        }, 1000 * 60));

        // XXX: listenTo
        $(window).on("blur", function() {
            self.save();
        });
    },

    save: function() {
        if (!this.model.get("dirty")) {
            console.log("Skipping autosave. Not dirty.");
            return;
        }

        console.log("Autosaving...");
        this.model.saveDraft(this.getContent())
        .then(function() {
            console.log("Autosave ok!");
        }).catch(errorReporter("Autosave failed"));
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
