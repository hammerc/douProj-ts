const gulp = require("gulp");
const rollup = require("rollup");
const rollupTypescript = require("rollup-plugin-typescript2");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");

gulp.task("buildJS", async function () {
    const bundle = await rollup.rollup({
        input: "./src/Main.ts",
        plugins: [
            rollupTypescript()
        ]
    });
    await bundle.write({
        file: "./bin/main.js",
        format: "iife",
        sourcemap: true
    });
});

gulp.task("default", gulp.series("buildJS"));
gulp.task("build", gulp.series("buildJS"));

gulp.task("uglify", function () {
    return gulp.src("./bin/main.js")
        .pipe(uglify({ compress: { global_defs: { DEBUG: false, RELEASE: true } } }))
        .pipe(rename({ basename: "main.min" }))
        .pipe(gulp.dest("bin"));
});

gulp.task("copy", function () {
    return gulp.src("./bin/**/*.js")
        .pipe(gulp.dest("./dest"));
});

gulp.task("publish", gulp.series("buildJS", "uglify", "copy"));
