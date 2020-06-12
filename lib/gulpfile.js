const gulp = require("gulp");
const rollup = require("rollup");
const rollupTypescript = require("rollup-plugin-typescript2");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const del = require("del");
const matched = require("matched");
const fs = require("fs");

gulp.task("clean", async function () {
    await del([
        "./bin/**/*",
        "./dest/**/*"
    ]);
});

gulp.task("index", async function () {
    let files = await matched.promise("./src/**/*.ts");
    let content = [];
    for (let file of files) {
        file = file.replace("src/", "./");
        file = file.replace(".ts", "");
        content.push(`export * from "${file}";`);
    }
    fs.writeFileSync("./src/index.ts", content.join("\r\n"), { encoding: "utf8" });
});

gulp.task("buildJS", async function () {
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

gulp.task("modifyJS", async function () {
    fs.unlinkSync("./src/index.ts");
    let content = fs.readFileSync("./bin/engine.js", { encoding: "utf8" });
    content = content.replace(/^var engine = \(function \(exports\) \{$/m, "(function (exports) {");
    content = content.replace(/^\}\(\{\}\)\);$/m, "}(window.engine = window.engine || {}));");
    fs.writeFileSync("./bin/engine.js", content, { encoding: "utf8" });
});

gulp.task("uglify", function () {
    return gulp.src("./bin/engine.js")
        .pipe(uglify({ compress: { global_defs: { DEBUG: false, RELEASE: true } } }))
        .pipe(rename({ basename: "engine.min" }))
        .pipe(gulp.dest("bin"));
});

gulp.task("modifyDTS", async function () {
    fs.unlinkSync("./bin/index.d.ts");
    let files = await matched.promise("./bin/**/*.d.ts");
    let content = [];
    for (let file of files) {
        let str = fs.readFileSync(file, { encoding: "utf8" });
        str = str.replace(/^import.+;$/gm, "");
        str = str.replace(/^export declare /gm, "");
        str = str.replace(/^export /gm, "");
        str = str.replace(/\r\n/g, "\r");
        str = str.replace(/^/gm, "    ");
        str = str.replace(/\r/g, "\r\n");
        str = str.replace(/^    $/gm, "");
        content.push(str);
    }
    content.unshift("declare namespace engine {");
    content.push("}");
    let fileContent = content.join("\r\n");
    fileContent = fileContent.replace(/(\n[\s\t]*\r*\n)/g, "\n").replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, "");
    fs.writeFileSync("./bin/engine.d.ts", fileContent, { encoding: "utf8" });
});

gulp.task("copy", function () {
    return gulp.src(["./bin/**/*.js", "./bin/engine.d.ts"])
        .pipe(gulp.dest("./dest"));
});

gulp.task("default", gulp.series("clean", "index", "buildJS", "modifyJS", "uglify", "modifyDTS", "copy"));
