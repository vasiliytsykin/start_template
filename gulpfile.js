var gulp =require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();


function sassToCss(inPath, outPath) {
    return gulp.src(inPath)
        .pipe(sass())
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.stream());
}

gulp.task('sass', function () {
    return sassToCss('src/sass/*.sass', 'src/css')
});


gulp.task('watch', ['sass'], function () {
    var sassInPath = 'src/sass/*.sass',
        allPath = 'src/**/*';

    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });

    gulp.watch(sassInPath, ['sass']);
    gulp.watch(allPath).on('change', browserSync.reload)
});