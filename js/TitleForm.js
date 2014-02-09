
var Viewmaster = require("viewmaster");
var $ = require("jquery");
var Promise = require("bluebird");

var ENTER = 13;

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
        "click .done": "submit",

        "keyup .title": function(e) {
            this.$slug.val(
                this.$title.val().toLowerCase().replace(/[^a-z]/g, "")
            );
        },

        "keyup input": function(e) {
            if (e.which === ENTER) this.submit();
        }
    },

    afterTemplate: function() {
        this.$title = this.$(".title");
        this.$slug = this.$(".slug");
    },

    submit: function() {
        this.defer.resolve({
            title: this.$title.val(),
            slug: this.$slug.val()
        });
    }




});

module.exports = TitleForm;



