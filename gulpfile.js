var gulp = require("gulp");
var browserify = require("gulp-browserify");
var sass = require("gulp-sass");

gulp.task("js", function() {
    gulp.src("js/index.js")
        .pipe(browserify({
            transform: ["hbsfy"],
            insertGlobals: true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest("./build/js"));
});

gulp.task("css", function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("./build/css"));
});

gulp.task("watch", function () {
  // gulp.watch("js/**", ["js"]);
  gulp.watch("scss/**", ["css"]);
});

gulp.task("default", ["js", "css", "watch"]);
