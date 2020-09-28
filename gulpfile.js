const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks-render')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

const { series, parallel } = gulp

const path = {
    src: {
        njkAll: './src/**/*.njk',
        njk: ['./src/pages/*.njk'],
        css: './src/*.css',
        js: './src/*.js',
    },
    dist: {
        html: './public',
        css: './public/css',
        js: './public/js',
    },
}

gulp.task('nunjucks', () => {
	return gulp.src(path.src.njk)
        .pipe(nunjucks({
            path: ['./src']
        }))
        .pipe(rename({
            dirname: './',
        }))
    	.pipe(gulp.dest(path.dist.html))
})

gulp.task('css', () => {
    const plugins = [
        autoprefixer(),
        cssnano(),
    ]

    return gulp.src(path.src.css)
        .pipe(postcss(plugins))
        .pipe(gulp.dest(path.dist.css))
})

gulp.task('js', () => {
    return gulp.src(path.src.js)
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    modules: false
                }],
            ]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
})

gulp.task('watch', () => {
	gulp.watch(path.src.njkAll, series('nunjucks'))
	gulp.watch(path.src.js, series('js'))
	gulp.watch(path.src.css, series('css'))
})

gulp.task('build', parallel('nunjucks', 'css', 'js'))

gulp.task('default', series('build', 'watch'))
