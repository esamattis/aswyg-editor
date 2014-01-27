
var Promise = require("bluebird");
var $ = require("jquery");

function promiseXHR(xhr) {
    return new Promise(function (resolve, reject) {
        xhr.addEventListener("error", reject);
        xhr.addEventListener("load", function(res) {
            if (res.target.status === 200) {
                return resolve(res.target.responseText);
            }

            console.error(
                "Bad response",
                res.target.status,
                res.target.responseText
            );

            reject(new Error("Bad response"));
        });
    });
}

function get(url) {
    return new Promise(function(resolve) {
        var xhr = new XMLHttpRequest();
        resolve(promiseXHR(xhr));
        xhr.open("GET", url);
        xhr.send(null);
    }).timeout(5000).then(JSON.parse);
}

function post(url, data) {
    return new Promise(function(resolve) {
        var xhr = new XMLHttpRequest();
        resolve(promiseXHR(xhr));
        console.log("SEDINGSAFD SA", url);
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send($.param(data));
    }).timeout(5000).then(JSON.parse);
}


module.exports = {
    get: get,
    post: post
};
