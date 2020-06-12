const gulp = require("gulp");
const rollup = require("rollup");
const rollupTypescript = require("rollup-plugin-typescript2");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const del = require("del");

gulp.task("clean", async function () {
    await del([
        "./bin/**/*",
        "./dest/**/*"
    ]);
});

gulp.task("build", async function () {
    const bundle = await rollup.rollup({
        input: ["./src/index.ts"],
        plugins: [
            rollupTypescript()
        ]
    });
    await bundle.write({
        file: "./bin/engine.js",
        format: "iife",
        name: "engine"
    });
});

gulp.task("uglify", function () {
    return gulp.src("./bin/engine.js")
        .pipe(uglify({ compress: { global_defs: { DEBUG: false, RELEASE: true } } }))
        .pipe(rename({ basename: "engine.min" }))
        .pipe(gulp.dest("bin"));
});

gulp.task("copy", function () {
    return gulp.src("./bin/**/*.js")
        .pipe(gulp.dest("./dest"));
});

gulp.task("default", gulp.series("clean", "build", "uglify", "copy"));
