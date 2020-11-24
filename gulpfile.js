const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks-render')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const terser = require('gulp-terser')
const babel = require('gulp-babel')
const image = require('gulp-image')
const clean = require('gulp-clean')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const { pipeline } = require('readable-stream')

const { series, parallel, src, task, dest, watch } = gulp

const path = {
    src: {
        njkAll: './src/**/*.njk',
        njk: ['./src/pages/*.njk'],
        css: './src/**/*.css',
        js: './src/**/*.js',
        images: './src/img/*.*',
        fonts: './src/font/*.ttf',
        other: ['./src/.htaccess', './src/**/*.html'],
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

task('nunjucks', () => {
	return pipeline(
        src(path.src.njk),
        nunjucks({
            path: ['./src']
        }),
        rename({
            dirname: './',
        }),
        dest(path.dist.html),
    )
})

task('css', () => {
    return pipeline(
        src(path.src.css),
        postcss([
            autoprefixer(),
            cssnano(),
        ]),
        dest(path.dist.css),
    )
})

task('js', () => {
    return browserify('./src/js/index.js')
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    modules: false,
                }],
            ]
        }))
        .pipe(terser({
            toplevel: true,
        }))
        .pipe(gulp.dest('./public/js'))
})

task('watch', () => {
	watch(path.src.njkAll, series('nunjucks'))
	watch(path.src.js, series('js'))
	watch(path.src.css, series('css'))
})

task('image', () => {
    return pipeline(
        src(path.src.images),
        image(),
        dest(path.dist.img),
    )
})

task('font', () => {
    return pipeline(
        src(path.src.fonts),
        dest(path.dist.font),
    )
})

task('other', () => {
    return pipeline(
        src(path.src.other),
        dest(path.dist.other),
    )
})

task('clean', () => {
    return pipeline(
        src('./public', { read: false, allowEmpty: true }),
        clean(),
    )
})

task('watch', () => {
	watch(path.src.njkAll, series('nunjucks'))
	watch(path.src.js, series('js'))
	watch(path.src.css, series('css'))
	watch(path.src.other, series('other'))
})

task('build', series('clean', parallel('nunjucks', 'css', 'js', 'image', 'font', 'other')))

task('default', series('build', 'watch'))
