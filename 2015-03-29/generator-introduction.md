```javascript
function* generateNaturalNumber() {
    var i = 0;
    while(i <= 100) {
        yield i;
        i++;
    }
}
```

#写在前面

Generator（生成器）是ES6引入的新特性，该特性早就出现在了从Python、C#等其他语言。

生成器本质上是一种特殊的[迭代器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/The_Iterator_protocol)。
>ES6 里的迭代器并不是一种新的语法或者是新的内置对象(构造函数), 而是一种协议 (protocol). 所有遵循了这个协议的对象都可以称之为迭代器对象. ——摘自MDN

根据迭代器协议可以很容易写出产生100以内自然数的迭代器
```javascript
function createNaturalNumber() {
    var i = 0;
    return {
        next: function next() {
            return {done: i >= 100, value: i++};
        }
    };
}
```
这种迭代器，每次迭代的值都跟上一次的值有关系，此时就需要使用闭包来维护内部状态。

文章开头是一个产生100以内自然数的生成器，可以看到减少了内部状态的维护，迭代也十分简单，可通过以下方式迭代
```javascript
for(var i of generateNaturalNumber()) {
    console.log(i);
}
```

#生成器的语法

生成器也是一种函数，语法上仅比普通function多了个星号* function*，在其函数体内部可以使用

#生成器的使用

#next()

#yield和yield*

