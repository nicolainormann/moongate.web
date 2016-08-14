var gulp = require('gulp');
var gulputil = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');
var htmltots = require('gulp-html-to-ts');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');

var lost = require('lost');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var browsersync = require('browser-sync').create();

var design = 'website/';
var assets = design + 'assets/';

var watchSync = [
    design + '**/*.html',
    design + '**/*.cshtml',
    design + '**/*.min.css',
    design + '**/*.min.js'
];

var watchScss = [
    design + '**/*.scss'
];

var watchTs = [
    design + '**/ts/**/*.ts'
];

var watchHTML = [
	design + '**/ts/**/*.html'
];

var library = {
	css: [
	],
	js: [
		'libraries/angular.js'
	]
};
/* FILE MASKS END */

gulp.task('default', ['browsersync', 'watchSync']);

gulp.task('library', ['libraryCss', 'libraryJs']);

gulp.task('browsersync', function () {
	browsersync.init({
		proxy: "moongate.web"
	});
});

gulp.task('watchSync', function () {
	gulp.watch(watchSync).on('change', function (file) {
		return gulp.src(file.path, { buffer: false })
		    .pipe(browsersync.stream());
	});

	gulp.watch(watchScss, ['sass']);

	gulp.watch(watchTs, ['ts']);

	gulp.watch(watchHTML, ['htmltots']);
});

gulp.task('sass', function () {
	return gulp.src(assets + 'scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.css'))
		.pipe(sass())
		.pipe(postcss([lost(), autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write('map/'))
		.pipe(gulp.dest(design + 'css/'));
});

gulp.task('ts', function () {
	return gulp.src(assets + 'ts/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts({ sortOutput: true }))
		.pipe(concat('main.min.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(sourcemaps.write('map/'))
		.pipe(gulp.dest(design + 'scripts/'));
});

gulp.task('htmltots', function () {
	return gulp.src(assets + 'ts/**/*.html')
		.pipe(htmltots())
		.pipe(concat('templates.ts'))
		.pipe(gulp.dest(assets + 'ts/templates/'));
});

gulp.task('libraryJs', function () {
	return gulp.src(library.js)
		.pipe(sourcemaps.init())
		.pipe(concat('library.min.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(sourcemaps.write('map/'))
		.pipe(gulp.dest(design + 'scripts/'));
});

gulp.task('libraryCss', function () {
	return gulp.src(library.css)
		.pipe(sourcemaps.init())
		.pipe(concat('library.min.css'))
		.pipe(postcss([lost(), autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write('map/'))
		.pipe(gulp.dest(design + 'css/'));
});