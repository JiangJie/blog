'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function() {
    return gulp.src('test.js')
        .pipe(babel())
        .pipe(gulp.dest('babel'));
});