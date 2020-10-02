const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks-render')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const terser = require('gulp-terser')
const babel = require('gulp-babel')
const { pipeline } = require('readable-stream')

const { series, parallel, src, task, dest, watch } = gulp

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
    return pipeline(
        src(path.src.js),
        babel({
            presets: [
                ['@babel/env', {
                    modules: false,
                }],
            ]
        }),
        terser({
            toplevel: true,
        }),
        dest(path.dist.js),
    )
})

task('watch', () => {
	watch(path.src.njkAll, series('nunjucks'))
	watch(path.src.js, series('js'))
	watch(path.src.css, series('css'))
})

task('build', parallel('nunjucks', 'css', 'js'))

task('default', series('build', 'watch'))
