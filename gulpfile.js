var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var header = require('gulp-header');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jsdoc = require('gulp-jsdoc3');

var SRC_FILES = ['src/feature-flags.module.js', 'src/feature-flags.provider.js', 'src/feature-flag.directive.js'];

gulp.task('default', dev);
gulp.task('build', build);
gulp.task('dev', dev);
gulp.task('doc', doc);

function dev() {
    return gulp.watch('src/*.js', ['build']);
}

function build() {
    // using data from package.json
    var pkg = require('./package.json');
    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');

    return gulp.src(SRC_FILES)
        .pipe(plumber())
        .pipe(concat('angular-feature-flags.js'))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist/'))
        .pipe(rename('angular-feature-flags.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
}

function doc() {
    // var config = require('./jsdocConfig');
    gulp.src(['README.md', 'src/*.js'], {
            read: false
        })
        .pipe(jsdoc());
}