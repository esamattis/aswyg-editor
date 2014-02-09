
var Main = require("./Main");
var Content = require("./Content");
var _ = require("underscore");

function Aswyg(el, backend) {
    this.model = new Content({}, {
        backend: _.omit(backend, "logout")
    });

    var main = new Main({
        el: el,
        model: this.model
    });

    main.on("logout", backend.logout);

    main.render();
}

Aswyg.prototype.getDraftUrl = function(j) {
    return this.model.get("draftUrl");
};

Aswyg.prototype.getPublicUrl = function(j) {
    return this.model.get("publicUrl");
};

Aswyg.prototype.setContent = function(data) {
    this.model.reset(data);
};

Aswyg.$ = require("jquery");
Aswyg.Promise = require("bluebird");

module.exports = Aswyg;
