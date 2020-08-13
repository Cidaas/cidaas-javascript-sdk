var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

var webpackConfig = require('./webpack.config.js');

gulp.task('build', function () {
  return gulp.src('src/main/index.js')
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('build/'));
});
