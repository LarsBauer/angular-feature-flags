var gulp = require('gulp');
var plumber = require('gulp-plumber');
var angularOrder = require('gulp-angular-order');
var concat = require('gulp-concat');
var iife = require('gulp-iife');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
    return gulp.src('src/*.js')
        .pipe(plumber())
        .pipe(angularOrder())
        .pipe(concat('angular-feature-flags.js'))
        .pipe(iife())
        .pipe(gulp.dest('dist/'))
        .pipe(rename('angular-feature-flags.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});
