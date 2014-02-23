
// Markdown helpers for Codemirror

function CMMD(editor) {
    this.editor = editor;
}

CMMD.prototype.wrap = function(start, middle, end) {

    if (this.editor.somethingSelected()) {
        var text = this.editor.getSelection();
        this.editor.replaceSelection(start + text + end);
        return;
    }

    var c = this.editor.getCursor();

    this.editor.replaceRange(start+middle+end, c, c);

    this.editor.setSelection({
        line: c.line,
        ch: c.ch + start.length
    }, {
        line: c.line,
        ch: c.ch + start.length + middle.length
    });

    this.editor.focus();
};

CMMD.prototype.bold = function() {
    this.wrap("**", "Bold Text", "**");
};

CMMD.prototype.italics = function() {
    this.wrap("*", "Italic Text", "*");
};

CMMD.prototype.heading1 = function() {
    this.wrap("# ", "Heading 1", "");
};

CMMD.prototype.heading2 = function() {
    this.wrap("## ", "Heading 2", "");
};

CMMD.prototype.heading3 = function() {
    this.wrap("### ", "Heading 3", "");
};


CMMD.prototype.link = function() {
    this.wrap("[", "Link Title", "](%base_url%/subpage)");
};

CMMD.prototype.image = function() {
    this.wrap("![", "Image Alt Text", "](http://placekitten.com/250/200)");
};

CMMD.prototype.list = function(start) {

    if (!this.editor.somethingSelected()) {
        return this.wrap(start, "List Item", "");
    }

    var text = this.editor.getSelection();

    text = text.split("\n").map(function(line) {
        return start + line;
    }).join("\n");

    this.editor.replaceSelection(text);
};


CMMD.prototype.ul = function() {
    this.list(" - ");
};

CMMD.prototype.ol = function() {
    this.list(" 1. ");
};

CMMD.prototype.table = function() {
    this.editor.replaceSelection([
        "First Header  | Second Header",
        "------------- | -------------",
        "Content Cell  | Content Cell",
        "Content Cell  | Content Cell"
        ].join("\n"));
};


module.exports = CMMD;
