const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks-render')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const image = require('gulp-image')
const clean = require('gulp-clean')

const { series, parallel } = gulp

const path = {
    src: {
        njkAll: './src/**/*.njk',
        njk: ['./src/pages/*.njk'],
        css: './src/**/*.css',
        js: './src/**/*.js',
        images: './src/img/*.*',
        fonts: './src/font/*.ttf',
        other: ['./src/.htaccess'],
    },
    dist: {
        html: './public',
        css: './public',
        js: './public',
        img: './public/img',
        font: './public/font',
        other: './public',
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

gulp.task('image', () => {
    return gulp.src(path.src.images)
        .pipe(image())
        .pipe(gulp.dest(path.dist.img))
})

gulp.task('font', () => {
    return gulp.src(path.src.fonts, { read: false })
        .pipe(gulp.dest(path.dist.font))
})

gulp.task('other', () => {
    return gulp.src(path.src.other, { read: false })
        .pipe(gulp.dest(path.dist.other))
})

gulp.task('clean', () => {
    return gulp.src('./public', { read: false })
        .pipe(clean())
})

gulp.task('watch', () => {
	gulp.watch(path.src.njkAll, series('nunjucks'))
	gulp.watch(path.src.js, series('js'))
	gulp.watch(path.src.css, series('css'))
})

gulp.task('build', series('clean', parallel('nunjucks', 'css', 'js', 'image', 'font', 'other')))

gulp.task('default', series('build', 'watch'))
