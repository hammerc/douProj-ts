const gulp = require("gulp");
const rollup = require("rollup");
const rollupTypescript = require("rollup-plugin-typescript2");

gulp.task("build", async function () {
    const bundle = await rollup.rollup({
        input: "./src/Main.ts",
        plugins: [
            rollupTypescript()
        ]
    });

    await bundle.write({
        file: "./bin/main.js",
        format: "iife",
        name: "main",
        sourcemap: true
    });
});

gulp.task("default", gulp.series("build"));
