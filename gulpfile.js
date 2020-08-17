const { src, dest, series, watch } = require("gulp");
const concat = require("gulp-concat");
const sync = require("browser-sync");
const del = require("del");
// js
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const strip = require('gulp-strip-comments');
// css
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const autoprefixer = require("gulp-autoprefixer");
// img
const imagemin = require("gulp-imagemin");
// html
const htmlmin = require("gulp-htmlmin");



const html = () => {
    return src("src/**/*.html")
        .pipe(
            htmlmin({
                collapseWhitespace: true,
            })
        )
        .pipe(concat("index.html"))
        .pipe(dest("build"));
}

const scripts = () => {
    return src("src/**/*.ts")
        .pipe(
            ts({
                noImplicitAny: true,
                experimentalDecorators: true,
            })
        )
        .pipe(concat("script.js"))
        .pipe(uglify())
        .pipe(strip())
        .pipe(dest("build"));
}

const scss = () => {
    return src("src/**/*.scss")
        .pipe(sass())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 2 versions"],
            })
        )
        .pipe(csso())
        .pipe(concat("main.css"))

        .pipe(dest("build"));
}


const images = () => {
    return src("src/assets/**")
        .pipe(
            imagemin({
                progressive: true,
            })
        )
        .pipe(dest("build/assets/"));
}
const clear = () => {
    return del("build");
}
const serve = () => {
    sync.init({
        server: "./build",
    });
    watch("app/**/*.html", series(html)).on("change", sync.reload);
    watch("app/**/*.scss", series(scss)).on("change", sync.reload);
    watch("app/**/*.js", series(scripts)).on("change", sync.reload);
    watch("app/assets/**", series(images)).on("change", sync.reload);
}

exports.serve = series(clear, scss, html, images, scripts, serve);
