[![Gulp][gulp-img]][gulp-img]

[Gulp][gulp]是一款基于Stream的前端构建工具，由于底层使用stream，相比使用临时文件的grunt要快不少，也不用写一大堆配置文件，每一个任务都可以自己完全控制逻辑。

# gulp 4.0的变化
gulp 4.0相对于以前的版本做了不少变化

使用新的任务系统bach，替换了老版本使用的orchestrator
移除了gulp.task传递三参数的用法，即这种用法将报错
```javascript
gulp.task('watch', ['default'], function() {
    // TODO
    // watch file
});
```
在gulp4.0之前，这种用法将会保证default任务先执行完再执行watch任务，gulp的任务流程控制就是这么实现的，不过这也是弱点之一。

对普通使用者来说，最大的变化有两点
### `gulp.task`的变化
当我们想在命令行通过敲`gulp taskname`的方式执行一个任务，这时候你应该使用gulp.task；当一个较复杂的任务（如dist）由很多个子任务组合而成的时候，子任务使用具名函数即可，将dist使用gulp.task注册，而不用像以前的版本，必须将每一个子任务都先使用gulp.task进行注册，然后再组合出dist，见最后的例子。

gulp.task又增加了一种用法，传递一个具名函数作为参数
```javascript
function compile() {
    // TODO
    gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}
gulp.task(compile);
```
等同于
```javascript
gulp.task('compile', function() {
    // TODO
    gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});
```
两者都可以通过命令行运行gulp compile执行任务

### 增加了`gulp.series`和`gulp.parallel`
解放军来了
如果你是gulp深度使用者，你一定不止一次吐槽过gulp的任务流程难以控制，就像电路一样，一条电路上很多电阻都是串联加并联的方式连接在一起，gulp一个复杂的任务同样也是由一些同步和异步的任务串在一起的。

你可能会用run-sequence或者event-stream等模块来解决，现在gulp带来了两个新的api`gulp.series`和`gulp.parallel`，帮助开发者解决恼人的任务流程控制问题。

假设有个任务dist
1.删除开发目录dev
    clean-dev
2.删除发布目录dist
    clean-dist
3.合图并修改css
    sprite
4.预编译css到dev
    compile-css
5.预编译js到dev
    compile-js
6.从src拷贝html到dev
    copy-html
7.对dev下面的js/css进行md5，并拷贝到dist
    reversion
8.替换dev下html中js/css进行过md5之后的文件路径，并拷贝到dist
    replcae

这只是一个普通的dist任务，我将dist拆得比较细，大致由以上8个步骤组成。
拆的粒度完全由自己控制，达到方便复用又便于理解的目的就行。

首先需要对每一个任务进行注册，这里只是为了说明问题，我省略了任务的具体代码。

```javascript
gulp.task('clean-dev', function() {// TODO});
gulp.task('clean-dist', function() {// TODO});
gulp.task('sprite', function() {// TODO});
gulp.task('compile-css', function() {// TODO});
gulp.task('compile-js', function() {// TODO});
gulp.task('copy-html', function() {// TODO});
gulp.task('reversion', function() {// TODO});
gulp.task('replcae', function() {// TODO});
```

然后，我们来理一理任务的流程，为了让任务执行效率更高，尽量保证能同时执行的都同时执行。简单画了个流程图来表示任务的流程，箭头表示先后顺序。

[![Task][task-img]][task-img]

可以看到图中既存在同步又存在异步，需要实现这样的流程，我们还需要注册额外的几个任务

```javascript
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
如果使用gulp4.0，只用这样就行了
```javascript
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
结合流程图和代码还是很好理解的。

扯了这么多，还是来说说怎么才能用上4.0吧，由于官方版目前还是3.9，想体验4.0只有通过github安装
`npm install gulpjs/gulp#4.0 -g`
`npm install gulpjs/gulp#4.0 --save-dev`
然后就可以愉快地用上gulp4.0了
只要没使用gulp.task传三个参数的用法，gulp4.0也是兼容老版本的gulpfile的。


[gulp]: http://gulpjs.com
[gulp-img]: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png
[task-img]: http://www.alloyteam.com/wp-content/uploads/2015/07/gulp4.0.png