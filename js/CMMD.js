
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

module.exports = CMMD;
