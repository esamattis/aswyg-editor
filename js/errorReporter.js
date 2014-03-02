
function format(err) {
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

    return str;

}

function errorReporter(msg) {
    return function(err) {

        console.error(msg + ".", format(err), err);
    };
}

errorReporter.format = format;

module.exports = errorReporter;
