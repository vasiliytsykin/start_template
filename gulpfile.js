var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    server = require('gulp-server-livereload');


gulp.task('serve', function () {
    gulp.src('src')
        .pipe(server({
            livereload: true,
            open: true
        }));
});


gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/css'));
});


gulp.task('watch', ['sass'], function () {
    gulp.watch('src/sass/**/*.sass', ['sass']);
});

gulp.task('default', ['serve', 'watch']);