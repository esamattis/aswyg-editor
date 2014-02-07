
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

        self.listenTo(self.toolbar, "saveDraft", function() {
            self.model.saveDraft(self.editor.getContent())
            .then(function() {
                self.preview.refresh();
            }, function(err) {
                console.error("Failed to save draft", err);
            });
        });

        self.listenTo(self.toolbar, "publish", function() {
            self.model.publish(self.editor.getContent())
            .then(function() {
                self.preview.refresh();
            }, function(err) {
                console.error("Failed to publish content", err);
            });
        });


        self.toolbar.on("new", function(e) {
            var d = new Dropdown({
                target: e.target
            });

            var tf = new TitleForm();
            d.setWidget(tf);
            d.render();

            tf.getTitle().then(function(t) {
                return self.model.reset(self.model.createNew(t));
            }, function(err) {
                console.error("Failed to create new page", err);
            });

        });


        self.listenTo(self.toolbar, "open", function(e) {
            var d = new Dropdown({
                target: e.target
            });

            var s = new SelectMenu({
                title: "Pages",
            });

            d.setWidget(s);

            d.render();

            s.selectFrom(self.model.fetchPageList())
            .then(function(page) {
                return self.model.reset(self.model.fetchPage(page));
            })
            .catch(Promise.CancellationError, function() {
                console.log("cancel");
            })
            .catch(function(err) {
                console.error("Failed to select page", err);
            });

        });
    }


});

module.exports = Layout;
