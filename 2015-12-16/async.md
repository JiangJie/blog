### 背景

笔者在前面的文章介绍过[如何使用generator来解决callback hell](http://www.alloyteam.com/2015/04/solve-callback-hell-with-generator/)，尽管现在多数浏览器特别是移动端浏览器还不支持该ES2015新特性，但你可以通过[Babel](https://babeljs.io/)等转换工具转化成ES5兼容的等效代码，从而在生产环境使用。

不过使用generator来解决callback hell似乎有点不务正业，毕竟generator是生成器，属于Iterator的一种，设计之初是用来生成一种特殊的迭代器的。

另外还有两点也可以算是generator解决callback hell问题的缺陷：
1. generator需要从generator function执行得到，而generator function执行之后只会返回一个generator，不管里面是怎样的代码，与我们通常对函数的认知存在差异
2. 如果想执行generator function的函数体，需要不断调用返回的generator的next方法，这样就决定了必须依赖[co](https://github.com/tj/co)或[bluebird.coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html)等其他辅助代码或者手动执行next，来保证generator不断next下去

>Tips：文章[ES6 Generator介绍](http://www.alloyteam.com/2015/03/es6-generator-introduction/)有介绍generator和generator function，以及它们之间的关系和区别。

众所周知，ES2015来的太晚了，而现在，TC39决定加快脚步，也许每年都会有新版本发布，明年可能会发布ES2016。ES2016终于给JS带来了async/await原生支持，而其他语言如C#、Python等更早就支持上了。

而async/await正是本文要重点介绍的用来解决callback hell问题的终极大杀器。
虽然离浏览器或nodejs支持ES2016还有很久很久，但依靠babel任然可以转换出当前环境就支持的代码。本文的最后还将分享笔者在生产环境使用async/await的经验，对，就是生产环境。

### async/await语法

函数声明
```
async function asyncFunc() {}
```

函数表达式
```
const asyncFunc = async function() {}
```

匿名函数
```
async function() {}
```

箭头函数
```
async () => {}
```

类方法
```
Class someClass {
    async asyncFunc() {}
}
```

没什么特别的，就在我们通常的写法前加上关键字`async`就行了，就像generator function仅仅比普通function多了一个*。

function前面加上`async`关键字，表示该function需要执行异步代码。
async function函数体内可以使用`await`关键字，且`await`关键字只能出现在async function函数体内，这一点和generator function跟yield的关系一样。

```
async function asyncFunc() {
    await anything;
}
```
await关键字可以跟在任意变量或者表达式之前，从字面很好理解该关键字有等待的意思，所以更有价值的用法是await后面跟一个异步过程，通常是Promise，
```
async function asyncFunc() {
    await somePromise;
}
```

如果用generator来解决callback hell，必须配合使用yield关键字和next方法，而理解清楚yield的作用和返回值以及next的参数作用就够消化两天了，await关键字不像yield关键字和next方法这么难以理解，它的意思就是等待，作用也是等待，而且一个关键字就够了。

>Tips：[前文](http://www.alloyteam.com/2015/03/es6-generator-introduction/)介绍yield的时候还提到了yield*，其实ES2016草案里面也提到了await*，不过它不是标准的一部分，草案并不要求必须实现，而且草案并不建议使用，不过后文还是会提到await*的用法。

### 做正确的事

用generator来解决异步函数回调问题始终觉得有些别扭，现在就让它做回本职工作吧，回调问题就交由async/await来解决————做正确的事。

先来回顾一下generator配合co来解决异步回调问题的方法，首先yy一个场景，见注释
```
co(*() => {
    try {
        // 获取用户名
        const name = yield $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = yield $.ajax(`get_my_info_by_name'?name=${name}`);
        // 打印个人信息
        console.log(info);
    } catch(err) {
        console.error(err);
    }
});
```

再来看看async/await的解决方式
```
(async () => {
    try {
        // 获取用户名
        const name = await $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = await $.ajax(`get_my_info_by_name'?name=${name}`);
        // 打印个人信息
        console.log(info);
    } catch(err) {
        console.error(err);
    }
})();
```

>Tips：代码片中用到了一些ES2015的新语法，不要介意，随便查一些文档就能看懂。

可以看到两种方法在代码的写法商非常相似，不严格的说，仅仅将function*换成async function，同时将函数体里面的yield关键字换成await关键字即可，顺便还可以把co等辅助工具抛弃了。

那么代价，哦不，好处是什么？
1. 更接近自然语言，async/await比function*/yield更好理解，需要异步执行的函数加一个标记async，调用的时候在前面加一个await，表示需要等到异步函数返回了才执行下面的语句
2. 无需依赖其他辅助代码，js原生能力支持
3. event listener、大量函数的callback等，不支持generator function，但是支持async function（所有支持普通function的地方都支持async function），无需co.wrap等辅助代码来包装
4. 在某些JS引擎执行generator function的bind方法，会返回一个普通function，尽管这是引擎的问题，async function不存在这样的问题，bind之后还是返回一个async function，从而可以避免一些意想不到的问题

### async function的返回值

值得注意的是，和generator function固定会返回一个generator类似，async function固定会返回一个promise，不管函数体里面有没有显示调用return。

如果有return，return后面的值都会被包装成一个promise，所以`return 'hello world'`和`return Promise.resolve('hello world')`其实是一样的效果。

由于async function返回一个promise，我们可以跟在await后面，类似这样
```
async function asyncFun1() {}
async function asyncFun2() {
    await asyncFun1();
}
async function asyncFun3() {
    await asyncFun2();
}
asyncFun3();
```

其实和下面的代码是一样的效果
```
async function asyncFun1() {}
async function asyncFun2() {}
async function asyncFun3() {
    await asyncFun1();
    await asyncFun2();
}
asyncFun3();
```
这样就达到多个异步函数串行执行的目的了，看起来就跟同步函数一样。

### await*
多个异步函数，有了串行执行的能力，自然也需要有并行执行的能力。

generator的方式
```
yield [promise1, promise2, ..., promisen]
```

>Tips：不是yield*

async的方式
```
await* [promise1, promise2, ..., promisen]
```
等效于
```
await Promise.all([promise1, promise2, ..., promisen])
```

不过草案并不推荐await*，以后的浏览器也不一定会实现这种语法，还是推荐使用Promise.all的方式，不过babel等转换工具是支持await*的。

### 在React中使用async/await

前文提过，笔者已在生产环境用过async function了，
当前React正火的不要不要的，前段时间正好借此机会用React搭了个内部使用的系统，
以展示个人信息（info）组件为例

个人信息需要发起后台请求才能得到，一般的做法是在`getInitialState`的时候返回一个初始值info，然后在`componentDidMount`里发起网络请求，得到info，再更新state，重新渲染组件。

```
React.createClass({
    getInitialState() {
        return {info: {}};
    },
    componentDidMount() {
        // 获取用户名
        $.ajax('get_my_name')
        .then(name => {
            // 根据用户名获取个人信息
            // 链式Promise
            return $.ajax(`get_my_info_by_name'?name=${name}`);
        }).then(info => {
            this.setSate({info});
        }).catch(err => {
            console.error(err);
        });
    },
    render() {
        // render info
    }
});
```

>Tips：使用箭头函数可以避免this错乱的问题，你肯定写过下面这样的代码

```
componentDidMount() {
    const self = this;
    // 获取用户名
    $.ajax('get_my_name')
    .then(name => {
        // 根据用户名获取个人信息
        // 链式Promise
        return $.ajax(`get_my_info_by_name'?name=${name}`);
    }).then(function(info) {
        self.setSate({info});
    }).catch(function(err) => {
        console.error(err);
    });
}
```

虽然async function的返回值一定是一个promise，然而我们并不关心componentDidMount的返回值，所以可以将一个async function赋值给componentDidMount，一切都会按照预期执行。
```
async componentDidMount() {
    try {
        // 获取用户名
        const name = await $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = await $.ajax(`get_my_info_by_name'?name=${name}`);
        this.setSate({info});
    } catch(err) {
        console.error(err);
    }
}
```

>Tips：没有闭包，没有作用域变化，可以放心使用this，错误处理直接使用try/catch

##### 最后一步

使用babel（配合构建工具或者单独使用babel-cli）将代码转换成兼容ES5的等效代码，本文不讲怎么使用[babel](https://babeljs.io/)，官网有详尽的教程。

如你所愿，在React中使用async/await就这么简单。

### 总结

1. 虽然async/await是ES2016才支持的新特性，目前尚处于草案状态，不过其作用和用法基本不会变了，一些其他语言已实现该特性，看来确实是大势所趋
2. 当下的JS引擎还没有原生支持async/await的，不过现在就可以使用babel转换成ES5等效代码，你甚至可以在生产环境使用
3. async/await才是解决异步回调的最佳实践，终于可以放归generator了