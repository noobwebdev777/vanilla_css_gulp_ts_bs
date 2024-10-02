const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const ts = require("gulp-typescript");
// Removed gulp-cache for this example
// const cache = require("gulp-cache");

const postCssPlugins = [
  require("postcss-import"),
  require("autoprefixer"),
  require("postcss-nested"),
  require("postcss-preset-env")({
    stage: 0,
  }),
  cssnano({
    preset: "default",
  }),
];

// TypeScript project configuration
const tsProject = ts.createProject("tsconfig.json");

// Task to process and minify CSS
gulp.task("css", function () {
  return gulp
    .src("./src/css/*.css")
    .pipe(sourcemaps.init())
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
});

// Task to compile and minify TypeScript without caching
gulp.task("ts", function (done) {
  const tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(tsProject());

  tsResult.js
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./public/js"))
    .pipe(browserSync.stream());

  done(); // Signal task completion
});

// Serve task
gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 5173,
    open: false,
    notify: false,
  });

  gulp.watch("./*.html").on("change", browserSync.reload);
  gulp.watch("./src/css/*.css", gulp.series("css"));
  gulp.watch("./src/ts/*.ts", gulp.series("ts")); // Watch for TypeScript changes
});

// Default task
gulp.task("default", gulp.series(gulp.parallel("css", "ts"), "serve"));
