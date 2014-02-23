
var $ = require("jquery");
var Backbone = require("backbone");
Backbone.$ = $;
var Viewmaster = require("viewmaster");
var Promise = require("bluebird");
Promise.longStackTraces();
var key = require("keymaster");

var Panes = require("./Panes");
var Editor = require("./Editor");
var Preview = require("./Preview");
var Toolbar = require("./Toolbar");
var Dropdown = require("./Dropdown");
var SelectMenu = require("./SelectMenu");
var TitleForm = require("./TitleForm");
var errorReporter = require("./errorReporter");
var Publish = require("./Publish");


var Layout = Viewmaster.extend({

    template: function() {
        return "<div class=container></div>";
    },

    constructor: function(opts) {
        var self = this;
        Viewmaster.prototype.constructor.apply(this, arguments);

        this.toolbar = new Toolbar({
            model: this.model
        });

        this.editor = new Editor({
            model: this.model
        });

        this.appendView(".container", this.toolbar);

        this.panes = new Panes();
        this.appendView(".container", this.panes);

        this.panes.setView(".left-pane", this.editor);

        this.preview = new Preview({
            model: this.model
        });
        this.panes.setView(".right-pane", this.preview);


        self.listenTo(self.toolbar, "all", function(eventName, arg) {
            self.editor.trigger(eventName, arg);
        });

        this.model.initialized.then(function() {
            self.panes.setPos(500);
        });

        self.listenTo(self.toolbar, "saveDraft", self.saveDraft.bind(self));
        key("ctrl+s", function(e) {
            self.saveDraft();
            return false;
        });

        self.listenTo(self.toolbar, "publish", function(e) {
            var view = new Publish({
                model: self.model
            });

            Dropdown.display(e.target, view);
        });


        self.listenTo(self.toolbar, "new", function(e) {
            var form = new TitleForm();
            Dropdown.display(e.target, form);

            form.getTitle().then(function(t) {
                if (typeof self.model.createNew === "function") {
                    return self.model.reset(self.model.createNew(t));
                }
                throw new Error("createNew is not implemented");
            }).then(function() {
                form.parent.remove();
            }, errorReporter("Failed to create new page"));

        });


        self.listenTo(self.toolbar, "open", function(e) {

            var menu = new SelectMenu({
                title: "Open",
            });

            Dropdown.display(e.target, menu);

            menu.selectFrom(self.model.fetchPageList())
            .then(function(page) {
                if (typeof self.model.fetchPage === "function") {
                    return self.model.reset(self.model.fetchPage(page));
                }
                throw new Error("fetchPage is not implemented");
            }).then(function() {
                menu.parent.remove();
            });

        });

        self.listenTo(self.toolbar, "delete", function(e) {
            if (!window.confirm("Delete this page?")) return;
            self.model.delete().catch(errorReporter("Failed to delete page"));
        });

        self.listenTo(self.toolbar, "externalPreview", function() {
            window.open(self.model.get("draftUrl") , "_blank");
        });


    },

    saveDraft: function() {
        var self = this;
        self.model.saveDraft(self.editor.getContent())
        .then(function() {
            self.preview.refresh();
        }, errorReporter("Failed to save draft"));
    }


});

module.exports = Layout;
