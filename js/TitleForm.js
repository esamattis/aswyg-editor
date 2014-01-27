
var Viewmaster = require("viewmaster");
var $ = require("jquery");
var Promise = require("bluebird");

var TitleForm = Viewmaster.extend({
    className: "bb-titleform",
    template: require("./TitleForm.hbs"),

    initialize: function() {
        this.defer = Promise.defer();
    },

    getTitle: function() {
        return this.defer.promise;
    },

    events: {
        "click .done": function(e) {
            this.defer.resolve({
                title: this.$title.val(),
                slug: this.$slug.val()
            });
        },

        "keyup .title": function(e) {
            this.$slug.val(
                this.$title.val().toLowerCase().replace(/[^a-z]/g, "")
            );
        }
    },

    afterTemplate: function() {
        this.$title = this.$(".title");
        this.$slug = this.$(".slug");
    }




});

module.exports = TitleForm;



