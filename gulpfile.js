var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var iife = require('gulp-iife');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

SRC_FILES = ['feature-flags.module.js', 'feature-flags.provider.js', 'feature-flag.directive.js'];

gulp.task('build', function () {
    return gulp.src(SRC_FILES)
        .pipe(plumber())
        .pipe(concat('angular-feature-flags.js'))
        .pipe(iife())
        .pipe(gulp.dest('dist/'))
        .pipe(rename('angular-feature-flags.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});