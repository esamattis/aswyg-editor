
var $ = require("jquery");
var Viewmaster = require("viewmaster");
var _ = require("underscore");

var Panes = Viewmaster.extend({

    className: "bb-panes",

    initialize: function(opts) {
        this.$overlay = $("<div />", {
            "class": "pane-drag-overlay"
        });
        this.$overlay.hide();
        this.$overlay.css({
            "position": "absolute",
            "top": "0px",
            "bottom": "0px",
            "left": "0px",
            "right": "0px",
            "z-index": "10000",
        });

    },

    events: {
        "mousedown .sep": function(e) {
            var self = this;
            self.$overlay.show();

            var throttled = _.throttle(function(e) {
                self._setPos(e.pageX, e.pageY);
            }, 20);

            $(window).on("mousemove", throttled);

            $(window).one("mouseup", function(e) {
                self._setPos(e.pageX, e.pageY);
                self.$overlay.hide();
                $(window).off("mousemove", throttled);
                self.broadcast("resizeend");
            });
        }
    },

    _setPos: function(x) {
        var margin = 50;
        x = Math.max(x, margin);
        x = Math.min(x, $(window.document).width() - margin);

        this.$left.css("width", x + "px");
        this.$sep.css("left", x + "px");
        this.$right.css("left", x + this.$sep.width() + "px");
    },

    setPos: function(x) {
        this._setPos(x);
        this.broadcast("resizeend");
    },

    template: require("./Panes.hbs"),

    afterTemplate: function() {
        this.$overlay.appendTo("body");
        this.$sep = this.$(".sep");
        this.$left = this.$(".left-pane");
        this.$right = this.$(".right-pane");
    },

    remove: function() {
        Viewmaster.prototype.apply.remove(this, arguments);
        this.$overlay.remove();
    }


});


module.exports = Panes;
