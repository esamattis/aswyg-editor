

function MarkdownAdapter(editor) {
    this.editor = editor;
}

MarkdownAdapter.prototype.insert = function(start, middle, end) {

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

MarkdownAdapter.prototype.bold = function() {
    this.insert("**", "Bold Text", "**");
};

MarkdownAdapter.prototype.italics = function() {
    this.insert("**", "Bold Text", "**");
};
