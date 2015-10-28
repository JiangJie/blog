'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const babel = require('babelify');
const source = require('vinyl-source-stream');

function compile() {
    const bundler = browserify('./src/index.js', {
        debug: true
    }).transform(babel.configure({
        optional: ['runtime']
    }));

    return bundler.bundle()
        .pipe(source('build.js'))
        .pipe(gulp.dest('./src'));
}

gulp.task('default', compile);