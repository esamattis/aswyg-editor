
var Viewmaster = require("viewmaster");
var $ = require("jquery");
var Promise = require("bluebird");

var SelectMenu = Viewmaster.extend({

    template: require("./SelectMenu.hbs"),

    initialize: function(opts) {
        this.error = false;
        this.title = opts.title;
    },

    events: {
        "click button": function(e) {
            this.trigger("select", $(e.target).data("value"));
            this.remove();
        }
    },

    remove: function() {
        Viewmaster.prototype.remove.apply(this, arguments);
        this.defer.reject(new Promise.CancellationError());
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
        self.defer = Promise.defer();
        self.once("select", function(v) {
            self.defer.resolve(v);
        });

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

        }, function(err) {
            console.error("failed to render dropdown", self, err);
            self.error = "Bad data";
            self.render();
            self.defer.reject(err);
        });

        return self.defer.promise;
    }

});


module.exports = SelectMenu;
