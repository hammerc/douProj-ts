# douProj-ts
项目开发示例，从零开始搭建一个 dou2d 类库和项目。

# 采用 es6 的模块开发

开发使用 es6 的模块写法，采用 export 和 import 的方式来引用其它类文件。

# 开发环境搭建

## 1. 搭建好 Node 项目

1. 执行 ```npm init``` 初始化 Node 项目；
2. 执行 ```tsc --init``` 初始化 ts 配置；

## 2. 修改 tsconfig.json 里面的 ```target``` 和 ```module``` 为 ```es2015```

## 3. 安装依赖库

```npm install --save-dev typescript gulp gulp-typescript rollup rollup-plugin-typescript2 del gulp-rename gulp-uglify-es```

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

# 类库开发关键点

1. 所有代码类都要导出到类库的 js 代码中；
2. 最外层被一个命名空间包围，外部调用可以通过 engine.XXX 调用到对应的 XXX 类；
3. 生成对应的 .d.ts 文件；

## 类库编译流程

1. 在 src 文件夹下创建 index.ts 文件，该文件会导入所有的类库代码文件，同时该文件会作为 rollup 编译的入口类，这样一来就可以导入所有类库代码；
   
   **index.ts 文件内容诸如下面这样：**

```
export * from "./game/a";
export * from "./game/b";
...
```

2. 通过编码，遍历所有的代码文件，将这些文件都按照上面的格式```export * from 代码路径;```写入 index.ts 中；

3. 将 index.ts 作为入口类开始发布 js 和 .d.ts 的代码；

4. 删除 index.ts 文件，该文件已经没有用了；

5. 发布后的 js 代码的第一行和最后一行需要调整一下，保证如果 engine 对象已经存在了，不会被当前类库覆盖；

6. 发布后的 .d.ts 代码，都是零散的，需要合并一下才能使用，同时这些 .d.ts 代码采用的是 es 的模块写法，所以也不能直接合并，同时要给这些 .d.ts 代码加上一个命名空间；

7. 处理好 .d.ts 文件之后，导出对应的 .min.js 代码，类库打包就完成了；

# 项目开发关键点

1. 通过入口类，只打包用到的代码，而不是所有代码都打包到 js 中；

   **这是 Rollup 自带的功能，不用额外处理。**

2. 类型不暴露到控制台，比如内部有一个单例 FightManager，那么之前白鹭开发的游戏控制台里面可以直接范围，而我们这里的代码控制台是不能访问的；

   **这是 Rollup 自带的功能，不用额外处理。代码实现包含在一个只执行函数中，外部无法直接访问。如果需要访问到，直接添加 window.xxx = xxx; 的代码在游戏中即可。**
