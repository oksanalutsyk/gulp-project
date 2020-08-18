const { src, dest, series, watch } = require("gulp");
const concat = require("gulp-concat");
const sync = require("browser-sync");
const del = require("del");
// js
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const strip = require('gulp-strip-comments');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const buffer = require('vinyl-buffer');
const glob = require('glob');
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
    const tsFiles = glob.sync('src/**/*.ts');
    return browserify({ entries: tsFiles })
        .plugin(tsify)
        .transform("babelify", { presets: ["@babel/preset-env"] })
        .bundle()
        // .pipe(
        //     ts({
        //         noImplicitAny: true,
        //         experimentalDecorators: true,
        //     })
        // )
        // .pipe(concat("script.js"))
        .pipe(strip())
        .pipe(source('script.js'))
        .pipe(buffer())
        .pipe(uglify())
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
