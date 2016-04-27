'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const babel = require('babelify');
const source = require('vinyl-source-stream');

function compile() {
    const bundler = browserify('./es2016.js', {
        // debug: true
    }).transform(babel.configure({
        // optional: ['runtime', 'es7.comprehensions']
        plugins: ['transform-runtime', 'array-includes'],
        presets: ['es2015', 'stage-0']
    }));

    return bundler.bundle()
        .pipe(source('build.js'))
        .pipe(gulp.dest('.'));
}

gulp.task('default', compile);

function watchFile() {
    gulp.watch('./es2016.js', compile);
}

gulp.task('watch', gulp.series('default', watchFile));