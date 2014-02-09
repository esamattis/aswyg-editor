
var Viewmaster = require("viewmaster");
var Promise = require("bluebird");


var Preview = Viewmaster.extend({

    className: "bb-preview",

    template: require("./Preview.hbs"),

    constructor: function(opts) {
        Viewmaster.prototype.constructor.apply(this, arguments);
        var self = this;
        this.scrollX = 0;
        this.scrollY = 0;

        this.listenTo(
            this.model,
            "saveDraft publish createNew",
            function(p) {
                p.then(function() {
                    self.refresh();
                });
            }
        );

        this.listenTo(
            this.model,
            "change:draftUrl",
            self.refresh.bind(this)
        );
    },


    afterTemplate: function() {
        this.$iframe = this.$("iframe");
    },

    getContentWindow: function() {
        return this.$iframe.get(0).contentWindow;
    },

    saveScroll: function(){
        var w = this.getContentWindow();
        if (w) {
            this.scrollX = w.scrollX;
            this.scrollY = w.scrollY;
        }
    },

    restoreScroll: function() {
        if (this.scrollX || this.scrollY) {
            this.getContentWindow().scrollTo(this.scrollX, this.scrollY);
        }
    },

    refresh: function() {
        var self = this;
        if (!this.getContentWindow()) return;

        self.saveScroll();

        return new Promise(function(resolve, reject) {

            self.$iframe.one("load", function() {
                self.restoreScroll();
                resolve();
            });

            self.getContentWindow().location.replace(
                self.model.get("draftUrl")
            );

        });
    }

});

module.exports = Preview;
