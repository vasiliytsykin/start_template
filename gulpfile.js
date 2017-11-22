var gulp = require('gulp'),
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		browserSync = require('browser-sync').create(),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		minifyCSS = require('gulp-clean-css');


function sassToCss(inPath, outPath) {
	return gulp.src(inPath)
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer())
			.pipe(gulp.dest(outPath));
}

gulp.task('sass', function () {
	return sassToCss('src/sass/*.sass', 'src/css')
});


gulp.task('css', function () {
	gulp.src('src/css/**/*.css')
			.pipe(minifyCSS())
			.pipe(concat('style.min.css'))
			.pipe(gulp.dest('dist/css'))
});

gulp.task('js', function () {
	gulp.src([
		'src/lib/jquery/dist/jquery.js',
		'src/lib/pickmeup/dist/pickmeup.min.js',
		'src/js/common_script.js',
		'src/js/formalizer.js',
		'src/js/main_script.js'
	])
			.pipe(concat('script.js'))
			.pipe(gulp.dest('src/js'));
});


gulp.task('watch', ['sass', 'js'], function () {
	var sassInPath = 'src/sass/*.sass',
			jsPath = ['src/js/*.js', '!src/js/script.js'],
			mainJSPath = 'src/js/script.js',
			cssPath = 'src/css/*.css',
			allPath = ['src/**/*', '!src/sass/**/*', '!src/css/**/*', '!src/js/**/*', '!src/lib/**/*'];

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