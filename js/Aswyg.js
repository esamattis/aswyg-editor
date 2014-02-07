
var Main = require("./Main");
var Content = require("./Content");
var _ = require("underscore");

function Aswyg(el, backend) {
    this.model = new Content({
        backend: _.omit(backend, "logout")
    });

    var main = new Main({
        el: el,
        model: this.model
    });

    main.on("logout", backend.logout);

    main.render();
}

Aswyg.prototype.setContent = function(data) {
    this.model.reset(data);
};


module.exports = Aswyg;
