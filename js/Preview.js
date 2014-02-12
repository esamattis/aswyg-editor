
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
        this.stayOnUrl = null;

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
        var self = this;
        self.$iframe = self.$("iframe");

        // Monitor whether the user navigates away from the current preview
        // page and restore.
        self.$iframe.on("load", function() {
            var url;
            try {
                url = self.getContentWindow().location.toString();
            } catch (err) { // DOMException
                // User navigated to another domain. Security exception.
                console.warn("Cannot access contentWindow. Restoring iframe", err);
                self.render();
                return;
            }

            if (self.stayOnUrl && self.stayOnUrl !== url) {
                console.warn("Navigated to", url, "returning...", self.stayOnUrl);
                self.render();
            } else {
                // On the first load register the url the iframe should stay at
                self.stayOnUrl = url;
            }


        });

    },

    getContentWindow: function() {
        return this.$iframe.get(0).contentWindow;
    },

    saveScroll: function(){
        var w = this.getContentWindow();
        if (w) {
            this.scrollX = w.scrollX || 0;
            this.scrollY = w.scrollY || 0;
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


            // Reset on refresh as the model might change
            self.stayOnUrl = null;

            self.getContentWindow().location.replace(
                self.model.get("draftUrl")
            );

        });
    }

});

module.exports = Preview;
