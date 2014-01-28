
require("../scss/app.scss");

var SITE_ROOT = "";

var Promise = require("bluebird");
Promise.longStackTraces();
var $ = require("jquery");
var Backbone = require("backbone");
Backbone.$ = $;

var request = require("./request");
var Panes = require("./Panes");
var Editor = require("./Editor");
var Preview = require("./Preview");
var Toolbar = require("./Toolbar");
var Dropdown = require("./Dropdown");
var SelectMenu = require("./SelectMenu");
var TitleForm = require("./TitleForm");
var Content = require("./Content");

function fetchPages() {
    return request.get(SITE_ROOT + "/pages.json");
}

function picoUrl(format) {
    return window.location.pathname + "?show=" + format;
}

var toolbar = new Toolbar();
toolbar.render();
$("body").append(toolbar.el);

var content = new Content();
var panes = new Panes();

var editor = new Editor({
    model: content
});

var preview = new Preview({
    previewUrl: picoUrl("preview")
});

panes.setView(".left-pane", editor);
panes.setView(".right-pane", preview);
panes.render();

content.initialized.then(function() {
    panes.setPos(500);
    content.savePreview(editor.getContent());
});

$("body").append(panes.el);

content.on("savePreview savePublic", function(p) {
    p.then(function() {
        return preview.refresh();
    });
});


content.fetch();


toolbar.on("preview", function() {
    content.savePreview(editor.getContent());
});

toolbar.on("publish", function() {
    content.savePublic(editor.getContent());
});


toolbar.on("new", function(e) {
    var d = new Dropdown({
        target: e.target
    });

    var tf = new TitleForm();
    d.setContent(tf);
    d.render();

    tf.getTitle().then(function(t) {
        window.localStorage.presetTitle = t.title;
        window.location = SITE_ROOT + t.slug + "?show=editor";
    });


});

editor.listenTo(toolbar, "all", function(eventName) {
    editor.trigger(eventName);
});

toolbar.on("open", function(e) {
    var d = new Dropdown({
        target: e.target
    });

    var s = new SelectMenu({
        title: "Pages",
    });

    d.setContent(s);

    d.render();

    s.selectFrom(fetchPages()).then(function(page) {
        console.log("TO", page);
        window.location = SITE_ROOT + page.url + "?show=editor";
    }).catch(Promise.CancellationError, function() {
        console.log("cancel");
    });


});

