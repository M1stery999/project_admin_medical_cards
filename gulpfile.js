import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import cssMin from "gulp-clean-css";
import uglify from "gulp-uglify";
import cleanDist from "gulp-clean";
import gulpImgMin from "gulp-imagemin";
import browserSync, { watch } from "browser-sync";
const sass = gulpSass(dartSass);

export function scss() {
  return gulp
    .src("./src/scss/**.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cssMin())
    .pipe(concat("style.min.css"))
    .pipe(gulp.dest("./dist/styles"));
}

export function jsMin() {
  return gulp
    .src("./src/js/**.js")
    .pipe(uglify())
    .pipe(concat("script.min.js"))
    .pipe(gulp.dest("./dist/js"));
}

export function clean() {
  return gulp.src("./dist").pipe(cleanDist());
}

export function watcherSync() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  watch("./src/scss/**/*.scss", gulp.series(scss)).on(
    "change",
    browserSync.reload
  );
  watch("./src/js/**/*.js", gulp.series(jsMin)).on(
    "change",
    browserSync.reload
  );
  watch("./**/*.html").on("change", browserSync.reload);
}

export function imgMin() {
  return gulp
    .src("./src/img/*")
    .pipe(
      gulpImgMin({
        progressive: true,
        optimizationLevel: 5,
      })
    )
    .pipe(gulp.dest("./dist/images"));
}

export const build = gulp.series(clean, scss, imgMin, jsMin);
export const dev = gulp.series(watcherSync);
