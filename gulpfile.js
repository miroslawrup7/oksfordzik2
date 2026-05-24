const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const replace = require('gulp-replace');
const fs = require('fs/promises');
const path = require('path');
const plumber = require('gulp-plumber');
const gulpEsbuild = require('gulp-esbuild');

// PostCSS plugins
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// Ścieżki dla struktury
const paths = {
    html: {
        src: 'src/**/*.html',
        dest: 'dist/',
    },
    js: {
        src: 'src/js/**/*.js',
        entry: 'src/js/main.js',
        dest: 'dist/js/',
    },
    scss: {
        entry: 'src/scss/main.scss',
        watch: 'src/scss/**/*.scss',
        dest: 'dist/css/',
    },
    img: {
        src: 'src/img/**/*',
        dest: 'dist/img/',
    },
    fonts: {
        src: 'src/fonts/**/*',
        dest: 'dist/fonts/',
    },
};

// Flaga środowiskowa
const isProd = process.env.NODE_ENV === 'production';

// Konfiguracja BrowserSync
const serverConfig = {
    server: { baseDir: 'dist' },
    notify: false,
    port: 3000,
};

// Czyszczenie katalogu dist
async function cleanDist() {
    const dir = path.resolve('dist');
    await fs.rm(dir, { recursive: true, force: true });
}

// HTML
function buildHtml() {
    return src(paths.html.src).pipe(plumber()).pipe(dest(paths.html.dest));
}

// Task do kopiowania obrazków
function buildImages() {
    return src(paths.img.src, { encoding: false }).pipe(plumber()).pipe(dest(paths.img.dest));
}

// Task do kopiowania fontów
function buildFonts() {
    return src(paths.fonts.src, { encoding: false }).pipe(plumber()).pipe(dest(paths.fonts.dest));
}

// JavaScript – ES Modules bundling
function buildJs() {
    return src(paths.js.entry)
        .pipe(plumber())
        .pipe(
            gulpEsbuild({
                bundle: true,
                sourcemap: !isProd,
                minify: isProd,
                format: 'esm',
                target: 'es2020',
                treeShaking: true,
                outdir: 'js',
            })
        )
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// SCSS → CSS
function buildScss() {
    return src(paths.scss.entry)
        .pipe(plumber())
        .pipe(!isProd ? sourcemaps.init() : require('gulp-noop')())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), isProd ? cssnano() : null].filter(Boolean)))
        .pipe(!isProd ? sourcemaps.write('.') : require('gulp-noop')())
        .pipe(dest(paths.scss.dest))
        .pipe(browserSync.stream());
}

// Cache busting
function cacheBust() {
    if (!isProd) return Promise.resolve();

    const timestamp = new Date().getTime();
    return src(['dist/**/*.html', 'dist/**/*.php'])
        .pipe(
            replace(/(href|src)=["']([^"']*\.(css|js))(["'])/gi, (match, attr, filePath, ext, quote) => {
                const separator = filePath.includes('?') ? '&' : '?';
                return `${attr}="${filePath}${separator}v=${timestamp}"${quote}`;
            })
        )
        .pipe(dest('dist'));
}

// Serwer i obserwacja plików
function serve() {
    browserSync.init(serverConfig);

    watch(paths.html.src, series(buildHtml, browserSync.reload));
    watch(paths.scss.watch, buildScss);
    watch(paths.js.src, series(buildJs, browserSync.reload));
}

// Eksportowane taski
exports.clean = cleanDist;
exports.build = series(cleanDist, parallel(buildHtml, buildScss, buildJs, buildImages, buildFonts), cacheBust);
exports.default = series(cleanDist, parallel(buildHtml, buildScss, buildJs, buildImages, buildFonts), serve);
