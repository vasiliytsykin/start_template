var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  minifyCSS = require('gulp-clean-css'),
  minifyJS = require('gulp-uglify'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  named = require('vinyl-named'),
  tmpDir = 'www';


gulp.task('sass', function () {
  return gulp.src('src/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(tmpDir + '/css'));
});


gulp.task('minifyCSS', function () {
  return gulp.src([tmpDir + '/css/**/*.css', '!'+ tmpDir + '/css/**/*.min.css'])
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(tmpDir + '/css'));
});

gulp.task('minifyJS', function () {
  return gulp.src([tmpDir + '/js/**/*.js', '!'+ tmpDir + '/js/**/*.min.js'])
    .pipe(minifyJS())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest(tmpDir + '/js'));
});

gulp.task('build', ['sass', 'js'], function () {
  console.log('build succeeded');
});

gulp.task('minify', ['minifyCSS', 'minifyJS'], function () {
  console.log('minify succeeded');
});


gulp.task('js', function () {
  return gulp.src('src/js/entry/*.js')
    .pipe(named())
    .pipe(webpackStream(require('./webpack.config'), webpack))
    .pipe(gulp.dest(tmpDir + '/js'));
});

gulp.task('vendorJs', function () {
  gulp.src([
    'src/lib/jquery/dist/jquery.js',
    'src/lib/pickmeup/dist/pickmeup.min.js',
    'src/lib/numeral/min/numeral.min.js',
    'src/lib/numeral/min/locales/ru.min.js',
    'src/lib/masonry/dist/masonry.pkgd.min.js',
    'src/lib/flickity/dist/flickity.pkgd.js',
    'src/lib/flickity-bg-lazyload/bg-lazyload.js',
    'src/lib/autosize/dist/autosize.min.js',
    'src/lib/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js',
    'src/lib/magnific-popup/dist/jquery.magnific-popup.min.js',
    'src/lib/FitText.js/jquery.fittext.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(tmpDir + '/js'));
});


gulp.task('watch', ['sass', 'vendorJs', 'js'], function () {
  var sassInPath = 'src/sass/*.sass',
    jsPath = ['src/js/**/*.js'],
    mainJSPath = tmpDir + '/js/**/*.js',
    cssPath = tmpDir + '/css/**/*.css',
    allPath = ['src/**/*', '!src/sass/**/*', '!src/css/**/*', '!src/js/**/*', '!src/lib/**/*', 'www/**/*.php'];

  browserSync.init({
    proxy: 'td.dock',
    notify: false,
    open: false
  });

  gulp.watch(sassInPath, ['sass']);
  gulp.watch(cssPath).on('change', browserSync.reload);
  gulp.watch(jsPath, ['js']);
  gulp.watch(mainJSPath).on('change', browserSync.reload);
  gulp.watch(allPath).on('change', browserSync.reload);
});