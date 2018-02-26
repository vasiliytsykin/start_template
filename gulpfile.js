var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  minifyCSS = require('gulp-clean-css'),
  minifyJS = require('gulp-uglify');

function sassToCss (inPath, outPath) {
  return gulp.src(inPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(outPath));
}

gulp.task('sass', function () {
  return sassToCss('src/sass/*.sass', 'www/css');
});

gulp.task('minifyCSS', function () {
  gulp.src(['www/css/**/*.css', '!www/css/**/*.min.css'])
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('www/css'));
});

gulp.task('minifyJS', function () {
  gulp.src(['www/js/**/*.js', '!www/js/**/*.min.js'])
    .pipe(minifyJS())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('www/js'));
});

gulp.task('build', ['minifyCSS', 'minifyJS'], function () {
  console.log('build succeeded');
});

gulp.task('js', function () {
  gulp.src([
    'src/lib/jquery/dist/jquery.js',
    'src/js/common_script.js',
    'src/js/main_script.js'
  ])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('www/js'));
});

gulp.task('watch', ['sass', 'js'], function () {
  var sassInPath = 'src/sass/*.sass',
    jsPath = ['src/js/*.js'],
    mainJSPath = 'www/js/script.js',
    cssPath = 'www/css/*.css',
    allPath = ['src/**/*', '!src/sass/**/*', '!src/css/**/*', '!src/js/**/*', '!src/lib/**/*', 'www/**/*.php']

  browserSync.init({
    proxy: 'your_site',
    notify: false,
    open: false
  });

  gulp.watch(sassInPath, ['sass']);
  gulp.watch(cssPath).on('change', browserSync.reload);
  gulp.watch(jsPath, ['js']);
  gulp.watch(mainJSPath).on('change', browserSync.reload);
  gulp.watch(allPath).on('change', browserSync.reload);
});