
var Viewmaster = require("viewmaster");
var $ = require("jquery");
var Promise = require("bluebird");

var SelectMenu = Viewmaster.extend({

    className: "bb-selectmenu",

    template: require("./SelectMenu.hbs"),

    initialize: function(opts) {
        this.error = false;
        this.title = opts.title;
    },

    events: {
        "click button,a": function(e) {
            e.preventDefault();
            this.trigger("_select", $(e.target).data("value"));
        }
    },

    context: function() {
        return {
            error: this.error,
            title: this.title,
            items: this._itemValues || []
        };
    },

    selectFrom: function(items) {
        var self = this;
        self.render();
        return new Promise(function(resolve, reject){
            self.once("_select", resolve);
            Promise.cast(items).then(function(values) {

                self._itemValues = values.map(function(v) {
                    return {
                        title: v.title,
                        value: JSON.stringify(v)
                    };
                });
                self._itemValues.sort(function(a, b) {
                    return a.title > b.title ? 1 : -1;
                });
                self.render();
            }, reject);

        }).catch(function(err) {
            console.error("failed to render select", self, err);
            self.error = "Bad data";
            self.render();
        });

    }

});


module.exports = SelectMenu;
