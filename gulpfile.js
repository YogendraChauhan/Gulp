const gulp = require('gulp');
const del = require('del');
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
var series = require('run-sequence');
const webserver = require('gulp-connect');

// delete production build
gulp.task('clean:build', function () {
    return del.sync('build');
});

// minifying javascripts
gulp.task('pack-js', function () {
    return gulp.src('app/scripts/*.js', { base: 'app' })
        .pipe(concat('scripts.bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/scripts'));  // Writes to 'build/scripts/*.js'
});

// minifying css
gulp.task('pack-css', function () {
    return gulp.src('app/css/*.css', { base: 'app' })
        .pipe(concat('style.bundle.css'))
        .pipe(minify())
        .pipe(gulp.dest('build/css'));
});

// writing all html files of app folder to build folder
gulp.task('pack-html', function () {
    return gulp.src('app/*.html', { base: 'app' })
    .pipe(gulp.dest('build'))
});

// injecting minified file path to all html
gulp.task("inject:path", function(){
    return gulp.src('build/*.html', { base: 'build' })
    .pipe(inject(gulp.src('build/css/*.css', {read: false}), {relative: true}))    
    .pipe(inject(gulp.src('build/scripts/*.js', {read: false}), {relative: true}))
    .pipe(gulp.dest('build'))
});

// optimize images
gulp.task('pack-image', function () {
    return gulp.src('app/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'));
});

// writing audio files to build folder
gulp.task('pack-audio', function () {
    return gulp.src('app/audio/*')
        .pipe(gulp.dest('build/audio'));
});

// watching file changes
gulp.task('watch', function () {
    return gulp.watch(['app/scripts/*.js', 'app/*.html', 'css/*.css'], ['livereload'], function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

//livereload
gulp.task('livereload', function() {
    gulp.src(['app/scripts/*.js', 'app/*.html', 'css/*.css'])
      .pipe(webserver.reload());
  });

// creating production build
gulp.task('build', function () { // create production build
    series('clean:build', 'pack-js', 'pack-css', 'pack-image', 'pack-audio', 'pack-html', 'inject:path');
});

//creating webserver tasks
gulp.task('webserver', function () {
    webserver.server({
        root: 'app',
        port: 8888,
        livereload: true
    });
});

// creating server task to live reload server on each modification
gulp.task('serve', ['webserver', 'livereload', 'watch']);