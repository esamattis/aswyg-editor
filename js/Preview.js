
var Viewmaster = require("viewmaster");
var Promise = require("bluebird");


var Preview = Viewmaster.extend({

  className: "bb-preview",

  template: require("./Preview.hbs"),

  constructor: function(opts) {
      Viewmaster.prototype.constructor.apply(this, arguments);
      var self = this;

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

    self.$iframe.attr("src", self.model.get("draftUrl"));
    return p;
  }

});

module.exports = Preview;
