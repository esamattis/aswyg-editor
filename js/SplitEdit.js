
require("../scss/app.scss");

var $ = require("jquery");
var Backbone = require("backbone");
Backbone.$ = $;
var Viewmaster = require("viewmaster");
var Promise = require("bluebird");
Promise.longStackTraces();

var Panes = require("./Panes");
var Editor = require("./Editor");
var Preview = require("./Preview");
var Toolbar = require("./Toolbar");
var Dropdown = require("./Dropdown");
var SelectMenu = require("./SelectMenu");
var TitleForm = require("./TitleForm");

var SplitEdit = Viewmaster.extend({

    template: function() {
        return "<div class=container></div>";
    },

    constructor: function(opts) {
        var self = this;
        Viewmaster.prototype.constructor.apply(this, arguments);

        this.toolbar = new Toolbar();
        this.appendView(".container", this.toolbar);

        this.panes = new Panes();
        this.appendView(".container", this.panes);

        this.editor = new Editor({
            model: opts.model
        });
        this.panes.setView(".left-pane", this.editor);

        this.preview = new Preview({
            model: opts.model
        });
        this.panes.setView(".right-pane", this.preview);

        this.model.initialized.then(function() {
            self.panes.setPos(500);
            self.model.savePreview(self.editor.getContent());
        });


        this.model.on("savePreview savePublic", function(p) {
            p.then(function() {
                return self.preview.refresh();
            });
        });

        this.model.on("change:previewUrl", function() {
            self.preview.refresh();
        });

        this.toolbar.on("save", function() {
            self.model.savePreview(self.editor.getContent());
        });

        self.toolbar.on("publish", function() {
            self.content.savePublic(self.editor.getContent());
        });


        self.toolbar.on("new", function(e) {
            var d = new Dropdown({
                target: e.target
            });

            var tf = new TitleForm();
            d.setContent(tf);
            d.render();

            // XXX: add adapter.open(name, value);
            tf.getTitle().then(function(t) {
                window.localStorage.presetTitle = t.title;
                window.location = "/" + t.slug + "?show=editor";
            });


        });

        self.editor.listenTo(self.toolbar, "all", function(eventName) {
            self.editor.trigger(eventName);
        });

        self.toolbar.on("open", function(e) {
            var d = new Dropdown({
                target: e.target
            });

            var s = new SelectMenu({
                title: "Pages",
            });

            d.setContent(s);

            d.render();

            s.selectFrom(self.model.fetchPages()).then(function(page) {
                console.log("TO", page);
                window.location = "/" + page.url + "?show=editor";
            }).catch(Promise.CancellationError, function() {
                console.log("cancel");
            });

        });
    }

});

module.exports = SplitEdit;
