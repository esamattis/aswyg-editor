
function errorReporter(msg) {
    return function(err) {
        var str = "";
        err = err || {};

        if (err.responseText) {
            str += "Ajax error: " + err.responseText;
        } else if (err.message) {
            str += "Error: " + err.message;
        } else {
            str += "Unknown Error: " + err.toString();
        }

        console.error(msg + ".", str, err);
    };

}
module.exports = errorReporter;
