
var $ = require("jquery");
var Promise = require("bluebird");

var Notification = {};

Notification.show = function(message) {
    var n = $("<div><p></p></div>");
    n.addClass("bg-notification");
    n.find("p").text(message);
    n.hide();
    $("body").append(n);
    n.fadeIn(500);
    return Promise.delay(n, 1000);
};

module.exports = Notification;
