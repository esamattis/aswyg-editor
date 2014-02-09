
var $ = require("jquery");
var Viewmaster = require("viewmaster");
var Promise = require("bluebird");

var Dropdown = Viewmaster.extend({

    className: "bb-dropdown",

    initialize: function(opts) {

        this.$target = $(opts.target);

        this.$overlay = $("<div />", {
            "class": "bb-dropdown-overlay"
        });
        this.$overlay.css({
            "position": "absolute",
            "top": "0px",
            "bottom": "0px",
            "left": "0px",
            "right": "0px",
            "z-index": "1000",
            // "background-color": "black",
            // "opacity": "0.4"
        });

    },

    template: require("./Dropdown.hbs"),


    afterTemplate: function() {
        var self = this;
        this.$overlay.appendTo("body");
        var o = this.$target.offset();
        $("body").append(this.el);
        var left = o.left;
        this.$el.css("left", left + "px");
        this.$el.css("top", o.top + this.$target.height() + "px");

        this.$overlay.one("click", function() {
            self.remove();
        });
    },

    setWidget: function(view) {
        this.listenToOnce(view, "done", this.remove.bind(this));
        this.setView(".container", view);
    },

    remove: function() {
        this.$overlay.remove();
        Viewmaster.prototype.remove.apply(this, arguments);
    }

});

Dropdown.display = function(el, view) {
    var d = new Dropdown({
        target: el
    });
    d.setWidget(view);
    d.render();
    $("body").append(d.el);
    return d;
};

module.exports = Dropdown;
