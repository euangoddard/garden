// Regular NPM dependencies
var argv = require('minimist')(process.argv.slice(2));
var browserSync = require('browser-sync');
var del = require('del');

// Gulp dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


var CONFIG = {
  is_release: !!argv.release
};

var reload = browserSync.reload;


gulp.task('clean', function () {
  del.sync(['./dist']);
});


gulp.task('compile-typescript', function () {
  var tsProject = $.typescript.createProject('tsconfig.json');
  gulp.src('src/typescript/**/*.ts')
    .pipe($.typescript(tsProject))
    .pipe($.if(CONFIG.is_release, $.uglify()))
    .pipe(gulp.dest('dist/js'));
});


gulp.task('copy-system-js', function () {
  gulp.src('node_modules/**/system.js')
    .pipe($.rename('system.js'))
    .pipe(gulp.dest('./dist/js/lib'));
});


gulp.task('sass', function () {
  var output_style = CONFIG.is_release ? 'compressed' : 'expanded';

  return gulp.src('./src/scss/**/*.scss')
    .pipe($.sass({
      outputStyle: output_style
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: [
    	'last 2 versions'
    ]}))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('build-html', ['sass', 'copy-system-js'], function () {
  var target = gulp.src('./src/index.html');
  var sources = gulp.src([
    './dist/js/lib/**/*.js',
    './dist/css/**/*.css'
  ], {read: false});

  return target
    .pipe($.inject(sources, {ignorePath: '/dist/'}))
    .pipe($.if(CONFIG.is_release, $.minifyHtml()))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build-html', 'compile-typescript']);


gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'Flowers',
    server: 'dist',
    baseDir: 'dist'
  });

  gulp.watch(['./src/**/*', './gulpfile.js'], ['build', reload]);
});


gulp.task('default', ['build']);
