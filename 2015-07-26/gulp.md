Gulp是一款基于Stream的前端构建工具，由于底层使用stream，相比使用临时文件的grunt要快不少，也不用写一大堆配置文件，每一个任务都可以自己完全控制逻辑。

如果你是gulp深度使用者，你一定不止一次吐槽过gulp的任务流程难以控制，就像电路一样，一条电路上很多电阻都是串联加并联的方式连接在一起，gulp一个复杂的任务同样也是由一些同步和异步的任务串在一起的。

你可能会用run-sequence或者event-stream等模块来解决，现在gulp带来了两个新的api`gulp.series`和`gulp.parallel`，帮助开发者解决恼人的任务流程控制问题。

假设有个任务dist
1.删除开发目录dev
2.删除发布目录dist
3.预编译css到dev
4.预编译js到dev
5.从src拷贝html到dev
6.计算js/css md5，并拷贝到dist
7.替换html中js/css文件路径，并拷贝到dist