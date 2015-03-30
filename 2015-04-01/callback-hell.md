![callback hell][1]

（图片来自于互联网） 

相信每一个JS程序员都曾被而且正在被回调地狱所折磨，特别是写过Nodejs代码的程序员。 

```javascript
asyncFun1(function(err, a) {
    // do something with a in function 1
    asyncFun2(function(err, b) {
        // do something with b in function 2
        asyncFun3(function(err, c) {
            // do something with c in function 3
        });
    });
});
```
JS的后续传递风格（回调）是这门语言的优点也是这门语言的缺点，优点之一是我们可以很轻易的写出异步执行的代码，而缺点也是由异步引起的，当太多的异步步骤需要一步一步执行，或者一个函数里有太多的异步操作，这时候就会产生大量嵌套的回调，使代码嵌套太深而难以阅读，即所谓的回调地狱。 

随着JS这门语言的发展，出现了很多解决回调地狱的解决方案。

如最基本的，使用具名函数并保持代码层级不要太深。
```javascript
function fun3(err, c) {
    // do something with a in function 3
}
function fun2(err, b) {
    // do something with b in function 2 
    asyncFun3(fun3);
}
function fun1(err, a) {
    // do something with a in function 1
    asyncFun2(fun2);
}
asyncFun1(fun1);
```

进阶一级的使用Promise或者链式Promise，但是还是需要不少的回调，虽然没有了嵌套。
```javascript
asyncFun1().then(function(a) {
    // do something with a in function 1
    asyncFun2();
}).then(function(b) {
    // do something with b in function 2
    asyncFun3();
}).then(function(c) {
    // do somethin with c in function 3
});
```

使用async等辅助库，代价是需要引入额外的库，而且代码上也不够直观。
```javascript
async.series([
    function(callback) {
        // do some stuff ...
        callback(null, 'one');
    },
    function(callback) {
        // do some more stuff ...
        callback(null, 'two');
    }
],
// optional callback
function(err, results) {
    // results is now equal to ['one', 'two']
});
```

现在，ES6来了，ES6带来了新一代解决回调地狱的神器——Generator，如果你不知道Generator是什么，可以看我之前写的[ES6 Generator介绍][2]。 

Generator本意上应该是一种方便按照某种规则生成元素的迭代器，不过鉴于其特殊的语法和运行原理，可以通过某种神奇的方式写出同步化的异步代码，从而避免回调，使代码更易阅读。

[前文][2]介绍过生成器的运行原理和yield、yield*、next等的用法，那么怎么用生成器写出异步执行的同步代码呢？

使用[CO][3]，可以这样写
```javascript
co(function*() {
    var a = asyncFun1();
    var b = asyncFun2(a);
    var c = asyncFun3(b);
    // do somethin with c
})();
```

最简单的CO
```javascript
function co(genFun) {
    // 通过调用生成器函数得到一个生成器
    var gen = genFun();
    return function(fn) {
        next();
        function next(err, res) {
            if(err) return fn(err);
            // 将res传给next，作为上一个yield的返回值
            var ret = gen.next(res);
            // 如果函数还没迭代玩，就继续迭代
            if(!ret.done) return ret.value(next);
            // 返回函数最后的值
            fn && fn(null, res);
        }
    }
}
```

 [1]: http://www.alloyteam.com/wp-content/uploads/2015/03/node-js-callback-hell.jpg
 [2]: http://www.alloyteam.com/2015/03/es6-generator-introduction
 [3]: https://github.com/tj/co