
function errorReporter(msg) {
    return function(err) {
        var str = "";

        if (!err) {
            str += "Rejection without an object!";
        } else if (err.responseText) {
            // jQuery ajax object
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
