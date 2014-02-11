var Aswyg = require("./js/Aswyg");

if (typeof module !== "undefined") {
    module.exports = Aswyg;
} else if (typeof window !== "undefined") {
    window.Aswyg = Aswyg;
}
