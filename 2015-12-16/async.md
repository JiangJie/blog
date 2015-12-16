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

再来看看async/await的解决方案
```
(async () => {
    try {
        // 获取用户名
        const name = $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = $.ajax(`get_my_info_by_name'?name=${name}`);
        console.log(info);
    } catch(err) {
        console.error(err);
    }
})();
```

代码片中用到了一些ES 2015的新语法，不要介意，随便查一些文档就能看懂。

