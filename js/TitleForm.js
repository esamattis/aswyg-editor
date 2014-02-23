
var Viewmaster = require("viewmaster");
var $ = require("jquery");
var Promise = require("bluebird");

var ENTER = 13;

var TitleForm = Viewmaster.extend({
    className: "bb-titleform",
    template: require("./TitleForm.hbs"),

    getTitle: function() {
        var self = this;
        return new Promise(function(resolve, reject){
            self.once("submit", function() {
                resolve({
                    slug: self.$slug.val().toLowerCase().replace(/[^a-z_]/g, "")
                });
            });
        });
    },

    afterTemplate: function() {
        this.$slug = this.$(".slug");
    },

    events: {
        "click .done": "submit",

        "keyup input": function(e) {
            if (e.which === ENTER) this.submit();
        }
    },

    submit: function() {
        this.trigger("submit");
    }


});

module.exports = TitleForm;



