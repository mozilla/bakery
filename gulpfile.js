'use strict';

var gulp = require('gulp');

var js = ['**/*.js', '!node_modules/**/*.js'];
var json = ['**/*.json', '!node_modules/**/*.json', '!tests/fixtures/**/*.json'];

gulp.task('beautify', ['beautify:javascript']);

gulp.task('beautify:javascript', function() {
    var beautify = require('gulp-jsbeautifier');

    gulp.src(js.concat(json), {
            base: './'
        })
        .pipe(beautify({
            indentSize: 4,
            keepFunctionIndentation: true
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('test', ['test:jshint']);

gulp.task('test:jshint', function() {
    var jshint = require('gulp-jshint');

    return gulp.src(js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
