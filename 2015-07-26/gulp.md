<p align="center">
  <a href="http://gulpjs.com">
    <img src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# 不得不说的废话
随着前端工程化的推进，相信越来越多的项目都用上了自动化构建。
对前端构建来说，使用最多的莫过于[grunt][grunt]和[gulp][gulp]。

本文的主角是gulp，所以花一两句话来介绍gulp还是有必要的。

gulp是一款基于[stream][stream]的前端构建工具，由于底层使用stream，可以将多个任务无缝串连在一起，相比使用临时文件的grunt要快不少；同时也不用像grunt一样写一大堆配置文件，每一个任务都可以可编程的来完全控制逻辑。

gulp比grunt“快”这是公认的事实，这里不再过多比较两者之间的差异，还是那句话，各有千秋吧。

# gulp 4.0的变化
扯完了废话，开始进入正题。
gulp团队大概在两个月前提交了[4.0分支][branch]，新版本带来了新的api，新api给任务流程控制带来了“革命性”的进步。
但新版本并未提交到npm，可能现在连alpha都算不上吧，不过还是可以先进行体验的。

### 安装gulp 4.0
想体验4.0只有通过github安装，执行以下两条命令即可在本地畅爽地使用gulp 4.0了。

`npm install gulpjs/gulp#4.0 -g`

`npm install gulpjs/gulp#4.0 --save-dev`

gulp 4.0相对以前的版本发生了不少变化

1. 使用新的任务系统`bach`，替换了老版本使用的`orchestrator`

也许会更快些？实际上gulp已经很快了，除非是超大型项目，否则几乎不用担心gulp构建会花太多时间，不过寻求更快总是好的。

2. 移除了gulp.task传递三参数的用法

即这种用法将报错
```js
gulp.task('watch', ['default'], function() {
    // TODO
    // watch file
});
```
在gulp4.0之前，这种用法将会保证default任务先执行完再执行watch任务，gulp的任务流程控制就是这么实现的，不过这也是老版本gulp的弱点之一。

对我们这些普通使用者来说，最大的变化有两点
### `gulp.task`的变化
gulp官方建议：

1. 当我们想在命令行通过敲`gulp taskname`的方式执行一个任务，这时候你应该使用`gulp.task`注册`taskName`

2. 当一个较复杂的任务（如dist）由很多个子任务组合而成的时候，子任务使用具名函数即可，不用单独为每个子任务进行注册，而只需将`dist`使用`gulp.task`进行注册，以前的版本则必须将每一个子任务都先使用`gulp.task`进行注册，然后再组合出`dist`，详细用法见最后的例子。

gulp.task又增加了一种用法，即传递一个具名函数作为参数，将自动注册以该函数名命名的任务
```js
function compile() {
    // TODO
    gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}
gulp.task(compile);
```
等同于
```
gulp.task('compile', function() {
    // TODO
    gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});
```
两者都可以通过命令行运行`gulp compile`执行任务

### 增加了`gulp.series`和`gulp.parallel`
哈哈，解放军来了。

如果你是gulp深度使用者，你一定不止一次吐槽过gulp的任务流程难以控制，就像一条复杂的电路一样，电路上很多电阻都是串联加并联的方式连接在一起，gulp一个复杂的任务同样也是由很多个子任务以串联（同步）加并联（异步）的方式连接在一起的。

老版本的gulp对多个异步任务很难控制，必须借助于第三方模块，如`run-sequence`、`event-stream`等，效果也并不理想。

现在gulp带来了两个新的api：`gulp.series`和`gulp.parallel`，这两个革命性的api将帮助开发者解决恼人的任务流程控制问题。

下面就来见识新api的神奇之处吧。
### example
以开发中最常见的dist任务为例，使用gulp首先得分解任务，dist大致分解成子任务如下

1. 删除开发目录dev，`clean-dev`
2. 删除发布目录dist，`clean-dist`
3. 合图并修改css中图片引用，`sprite`
4. 预编译css（如sass）到dev，`compile-css`
5. 预编译js到dev，`compile-js`
6. 从src拷贝html到dev，`copy-html`
7. 对dev下面的js/css进行md5，再拷贝到dist，`reversion`
8. 替换dev下html中js/css进行过md5之后的文件路径，并拷贝到dist，`replcae`

这只是一个普通的dist任务，我将dist拆得比较细并省略了压缩合并等常规任务，大致由以上8个步骤组成。

拆的粒度完全由自己控制，达到方便复用又便于理解的目的就行。

使用老版本的gulp，首先需要对每一个任务进行注册，这里只是为了说明问题，我省略了任务的具体代码。

```
gulp.task('clean-dev', function() {// TODO});
gulp.task('clean-dist', function() {// TODO});
gulp.task('sprite', function() {// TODO});
gulp.task('compile-css', function() {// TODO});
gulp.task('compile-js', function() {// TODO});
gulp.task('copy-html', function() {// TODO});
gulp.task('reversion', function() {// TODO});
gulp.task('replcae', function() {// TODO});
```

然后，我们来理一理任务的流程，为了让任务执行效率更高，尽量保证能同时执行的都同时执行，这里简单画了个流程图来表示任务的流程，箭头表示先后顺序。

[![Task][task-img]][task-img]

可以看到图中既存在同步又存在异步的任务，需要实现这样的流程，我们还需要修改和注册额外的几个任务，并借助run-sequence等第三方模块。

```
gulp.task('compile-css', ['sprite']);
gulp.task('dev', ['clean-dev'], function() {
    runSecquence(['compile-css', 'compile-js', 'copy-html']);
});
gulp.task('md5', ['dev', 'clean-dist'], function() {
    runSecquence('reversion');
});
gulp.task('dist', ['md5'], function() {
    runSecquence('replcae');
});
```
gulp官方推荐将任务最小化，每一个任务只做一件明确的事，可以看到任务拆得越细需要注册的任务就越多，为了处理同时涉及到同步和异步的任务，需要引进额外的中间任务来衔接，在代码上也不够自然。

如果使用gulp 4.0，只用这样就行了

```
function cleanDev() {// TODO}
function cleanDist() {// TODO}
function sprite() {// TODO}
function compileCss() {// TODO}
function compileJs() {// TODO}
function copyHtml() {// TODO}
function reversion() {// TODO}
function replcae() {// TODO}

gulp.task('dist', gulp.series(
    gulp.parallel(
        gulp.series(
            cleanDev,
            gulp.parallel(
                gulp.series(
                    sprite,
                    compileCss
                ),
                compileJs,
                copyHtml
            )
        ),
        cleanDist
    ),
    reversion,
    replcae
));
```

`gulp.series`和`gulp.parallel`都可以接受以`gulp.task`注册的任务名干脆就是一个（多个）函数，省去了一大堆gulp.task的代码，同时也达到了任务复用的目的，将子任务经过不同的组合又可以产生新的任务。

结合流程图，上面的代码还是很好理解的。

另外再说一点，只要在gulpfile.js中没有使用gulp.task传三个参数的用法，gulp 4.0也是兼容老版本的gulpfile.js的。

[官方升级日志][changelog]中也列出了一些其他的说明，想升级到4.0又想完全兼容老版本gulpfile.js的开发者最好还是看看咯。


[grunt]: http://gruntjs.com
[gulp]: http://gulpjs.com
[stream]: https://nodejs.org/api/stream.html
[branch]: https://github.com/gulpjs/gulp/tree/4.0
[gulp-img]: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png
[task-img]: http://www.alloyteam.com/wp-content/uploads/2015/07/gulp4.0.png
[changelog]: https://github.com/gulpjs/gulp/blob/4.0/CHANGELOG.md