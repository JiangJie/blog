'use strict';

gulp.task('watch', ['default'], function() {
    // TODO
    // watch file
});

function compile() {
    // TODO
    gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}
gulp.task(compile);

gulp.task('compile', function() {
    // TODO
    gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});