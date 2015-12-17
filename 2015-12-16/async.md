前面的文章我介绍过[如何使用Generator解决回调地狱](http://www.alloyteam.com/2015/04/solve-callback-hell-with-generator/)，排除支持环境的因素，Generator还是存在一些缺陷，
1. Generator本意还是一种Iterator
2. 从Generator需要从Generator Function执行得到，而Generator Function执行之后只会返回一个Generator，不管里面是怎样的代码，与我们通常对函数的认知存在差异
3. Generator必须不断调用next方法才会执行里面的代码，这样就决定了必须依赖[co](https://github.com/tj/co)或[bluebird.coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html)等其他辅助代码来保证Generator不断next下去

本文再结合实际使用场景，为读者介绍Async/Await组合

### 语法

```
async function asyncFunc() {
    await anything;
}
```

更有用的用法
```
async function asyncFunc() {
    await somePromise;
}
```

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

没什么特别的，就在我们通常的写法前加上关键字`async`就行了，就像generator function仅仅比普通function多了一个*

在async function函数体里面可以使用`await`关键字，而且await关键字也只能在async function使用，就像yield关键字只能在generator function使用一样

介绍yield的时候还提到了yield*，其实草案里面也提到了await*，不过它不是标准的一部分，草案并不要求必须实现，它的用法后文会说到

### 做正确的事
用Generator来解决异步函数回调问题始终觉得有些别扭，现在就让他做回本职工作吧，回调问题交由async/await来解决——做正确的事

先来回顾一下Promise解决异步回调问题的方法
首先yy一个场景，见注释
```
(() => {
    // 获取用户名
    $.ajax('get_my_name')
    .then(name => {
        // 根据用户名获取个人信息
        // 链式Promise
        return $.ajax(`get_my_info_by_name'?name=${name}`);
    }).then(info => {
        console.log(info);
    }).catch(err => {
        console.error(err);
    });
})();
```

再来看看async/await的解决方式
```
(async () => {
    try {
        // 获取用户名
        const name = await $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = await $.ajax(`get_my_info_by_name'?name=${name}`);
        console.log(info);
    } catch(err) {
        console.error(err);
    }
})();
```

代码片中用到了一些ES 2015的新语法，不要介意，随便查一些文档就能看懂。

可以看到代码的写法跟之前我们使用generator的方式非常像，不严格的说，仅仅将function*换成async function，同时将函数体里面的yield关键字换成await关键字即可。

那么好处是什么
1. 更接近自然语言，async/await比function*/yield更好理解，需要异步执行的函数加一个标记async，调用的时候在前面加一个await，表示需要等到异步函数返回了才执行下面的语句
2. 无需依赖其他辅助代码，js原生能力支持
3. event listener、callback等函数，不支持generator function，但是支持async function，无需co.wrap等辅助代码来包装

### async function的返回值
值得注意的是和generator function固定会返回一个generator类似，async function固定会返回一个promise，不管函数体里面有没有显示调用return，而且return后面的值都会被包装成一个promise，所以return 'hello world'和return Promise.resolve('hello world')其实是一样的结果。

由于async function返回一个promise，可以跟在await后面，类似这样
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

### await*
await* [promise1, promise2, ..., promisen]
等效于
await Promise.all([promise1, promise2, ..., promisen])
不过await*草案并不推荐实现，推荐使用Promise.all的方式，不过babel等转换工具是支持的。

之前讲的是多个异步函数串行执行，这里讲的是多个异步函数并行执行。
类似
yield [promise1, promise2, ..., promisen]
注意，不是yield*

总的来说，还是推荐await Promise.all([promise1, promise2, ..., promisen])这种方式处理并行执行的多个异步函数。

### 在React中使用async/await
假设有个展示个人信息（info）的组件，而个人信息需要发起网络请求才能得到，一般的做法是在getInitialState的时候返回一个初始值info，然后在componentDidMount里发起网络请求，得到info，再更新state，重新渲染组件。
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
tips：使用箭头函数可以避免这种熟悉的代码
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
因为我们并不关心componentDidMount的返回值，所以可以将一个async function赋值给componentDidMount，一切都按照预期在执行。
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
没有闭包，没有作用域变化，可以放心使用this。

以上代码片都可以通过babel转换成兼容ES5的等效代码，本文不讲怎么使用[babel](https://babeljs.io/)，官网有详尽的教程。
