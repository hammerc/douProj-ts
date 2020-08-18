# douProj-ts
项目开发示例，从零开始搭建一个 dou2d 项目。

# 采用 es6 的模块开发

开发使用 es6 的模块写法，采用 export 和 import 的方式来引用其它类文件。

# 开发环境搭建

## 1. 搭建好 Node 项目

1. 执行 ```npm init``` 初始化 Node 项目；
2. 执行 ```tsc --init``` 初始化 ts 配置；

## 2. 修改 tsconfig.json 里面的 ```target``` 和 ```module``` 为 ```es2015```

## 3. 安装依赖库

```npm install --save-dev typescript gulp gulp-typescript gulp-uglify-es gulp-rename del matched rollup rollup-plugin-typescript2```

## 4. 创建 ```gulpfile.js``` 文件

```
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
```
