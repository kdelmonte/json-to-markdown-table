/* jshint node:true*/

'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('build', ['js', 'css']);

gulp.task('default', ['build']);

gulp.task('js', function() {
  var b = browserify({
    entries: './app.js',
    debug: true,
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.rename('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('css', function() {
  var HIGHLIGHT_JS_THEME = 'monokai';
  return gulp.src([
      'node_modules/highlight.js/styles/' + HIGHLIGHT_JS_THEME + '.css',
      'app.css'
    ])
    .pipe($.concatCss("bundle.css"))
    .pipe(gulp.dest('dist/'));
});

gulp.task('test', ['watch'], function() {
  gulp.src('./')
    .pipe($.webserver({
      fallback: 'index.html',
      livereload: true,
      open: true
    }));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('./app.js', ['js']);
  gulp.watch('./app.css', ['css']);
});