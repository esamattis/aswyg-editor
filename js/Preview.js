
var Viewmaster = require("viewmaster");
var Promise = require("bluebird");


var Preview = Viewmaster.extend({

  className: "bb-preview",

  template: require("./Preview.hbs"),

  afterTemplate: function() {
    this.$iframe = this.$("iframe");
  },

  saveScroll: function(){
    var el = this.$iframe.get(0);
    this.scrollX = el.contentWindow.scrollX;
    this.scrollY = el.contentWindow.scrollY;
  },

  restoreScroll: function() {
    var win = this.$iframe.get(0).contentWindow;
    win.scrollTo(this.scrollX, this.scrollY);
  },

  refresh: function() {
    var self = this;
    self.saveScroll();

    var p =  new Promise(function(resolve, reject) {
      self.$iframe.one("load", function() {
          self.restoreScroll();
          resolve();
      });
    });

    self.$iframe.attr("src", self.model.get("previewUrl"));
    return p;
  }

});

module.exports = Preview;
