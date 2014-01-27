
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

            "background-color": "black",
            "opacity": "0.4"
        });
    },


    template: require("./Dropdown.hbs"),


    afterTemplate: function() {
        var self = this;
        this.$overlay.appendTo("body");
        var o = this.$target.offset();
        $("body").append(this.el);

        console.log(o);
        var targetHalf = this.$target.width() / 2;
        var left = o.left + targetHalf;
        left = Math.max(left, 10);

        this.$el.css("left", left + "px");
        this.$el.css("top", o.top + this.$target.height() + "px");

        this.$overlay.one("click", function() {
            self.remove();
        });
    },

    setContent: function(view) {
        this.setView(".container", view);
    },

    remove: function() {
        this.$overlay.remove();
        Viewmaster.prototype.remove.apply(this, arguments);
    }

});


module.exports = Dropdown;
