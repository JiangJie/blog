![TDZ](https://camo.githubusercontent.com/d78498fe3e4c26b8e78465c351bc15c0b6a50598/687474703a2f2f776573626f732e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30392f646561642d7a6f6e652e706e67)
（图片来自互联网）

>TDZ是ES6新引入的一个与作用域有关的新机制，该机制旨在规范JS的变量使用。

# TDZ

TDZ（Temporal Dead Zone），是ES6新引入的一个与作用域有关的新概念。

先来个直观的感受，

```javascript
{
    console.log(a);
    let a = 1;
}
```

可以在Chrome控制台试一下，运行结果将会报错`Uncaught ReferenceError: a is not defined`。

神奇吧，居然报错了，不过是不是看起来更像C语言的行为了？

对JS稍微有些了解的初学者可能会产生两点疑问，

1. 也许`let`不会有变量提升现象了，才会报错？
2. `console.log(a);`这个`a`为啥不可以是全局变量呢，难道因为`a`不存在才报错？

好吧，再看一个大家都认识的，把`let`换成`var`，

```javascript
{
    console.log(a); // undefined
    var a = 1;
}
```

和预期一样，将会打印`undefined`，嗯，确实是熟悉的味道。

两段代码唯一的不同只有变量声明方式，前者用`let`，后者用`var`，那为什么就报错呢，`let`有什么神奇的地方吗？

其实`let`确实没有什么特别神奇的地方，相比`var`，除了增加了块级作用域的能力。

另外值得一提的是，`let`（包括`const`）也存在变量提升现象，所以疑问1并不是关键原因。

辣么，是什么造成两者结果不同呢，答案是`TDZ`。

### 什么是TDZ

JS引擎在执行代码的时候是从上往下执行，不过在创建变量的时候有点特殊。

当代码进入到一段作用域（全局、函数、块级等）的时候，引擎会先将所有需要声明的变量取出来进行创建，**这一步发生在执行任何实际代码之前**，于是在真正运行代码之前，变量就存在了，这个现象就叫做变量提升，即：作用域内的变量都被提升到了作用域顶部，不管这些变量是在哪行声明的。

差别在于，ES6规范指出，通过`let`和`const`声明的变量在创建后需放在一个叫做TDZ的区域，当代码真正运行到变量初始化的那一行（`let a = 1`），才会将变量从TDZ移除，任何尝试访问存在于TDZ的变量都会报错。

看看使用`let`的执行过程，

```javascript
{   
    // 进入块级作用域，检查需要声明的变量
    // 创建变量a，由于a是通过let进行声明的，需要放进TDZ

    // 由于变量a存在于TDZ，访问报错
    console.log(a);

    // 初始化变量a，并赋值为1，从TDZ移除a
    let a = 1;
}
```

再看看使用`var`的执行过程，

```javascript
{
    // 进入块级作用域，检查需要声明的变量
    // 创建变量a，由于a是通过var进行声明的，直接初始化为undefined

    // 变量a不存在于TDZ，并且已经初始化为undefined
    console.log(a); // undefined

    // 将变量a赋值为1
    var a = 1;
}
```

事实上，ES6引入TDZ，让变量定义在使用上更接近C语言系的习惯，尽管变量提升一直存在，但TDZ很大程度上可以消除JS初学者对该现象的疑惑（看起来就像没提升）。

再来看看一个更具迷惑性的例子，该例子可以很好的回答前文假设的疑问2，

```javascript
let a = 2;
{
    console.log(a);
    let a = 1;
}
```

运行结果还是一样，报错`Uncaught ReferenceError: a is not defined`。

这下变量`a`在外层确定是存在的了，所以`console.log(a);`这里的`a`并不是外层定义的`a`。事实上，这个`a`还是里层的`a`，同样是因为处在TDZ而报错。

这一点还是很好理解的，由于 **Variable Shadowing** 原理，里层的`a`Shadow了外层的`a`，在里层并不能访问到外层的同名变量。

### typeof不再安全

在ES6之前，`typeof`被认为是检查变量的最安全的方法，不管变量是什么类型，不管变量是否存在，typeof总能返回一个确定的值，更不可能会报错。

特别是检查变量是否存在，`typeof`很受欢迎，请看一段熟悉的代码，

```javascript
(function(options) {
    typeof defalutOptions !== 'undefined' && (options = {...options, ...defalutOptions});
})({});

const defalutOptions = {};
```

如你所料，结果报错`Uncaught ReferenceError: defalutOptions is not defined`。

同样是因为`defalutOptions`处在TDZ而报错，这说明`typeof`也已不再安全，TDZ真是很强势啊。

为了避免这种问题，请老老实实将变量初始化写在变量访问之前，

```javascript
const defalutOptions = {};

(function (options) {
    typeof defalutOptions !== 'undefined' && (options = {...options, ...defalutOptions});
})({});
```

### 默认参数的TDZ

默认参数有种奇特的玩法，

代码一：
```javascript
(function(a, b = a) {
    console.log(a, b); // 打印出1, 1
})(1);
```

如果稍微改一下呢，

代码二：
```javascript
(function(a = b, b) {
    console.log(a, b);
})(undefined, 1);
```

运行报错`Uncaught ReferenceError: b is not defined`。

函数在执行时，先创建所有形参，同时放进TDZ，然后 **从左到右** 开始初始化形参并赋值。

默认参数在运行时需要用到的时候才计算。

在代码一中，参数`b`使用默认值，这时候`a`已经初始化好了，不存在于TDZ，所以工作正常。

代码二中，参数`a`使用默认值，由于参数初始化是从左到右进行的，这时候`b`还没初始化，还在TDZ，所以访问`b`就报错了。

类似的，由于 **Variable Shadowing** ，下面两段代码也会报错，

```javascript
let a = 1;

(function(a = a) {
    console.log(a); // Uncaught ReferenceError: a is not defined
})();
```

```javascript
let b = 1;

(function(a = (function() {return b;})(), b) {
    console.log(a, b); // Uncaught ReferenceError: b is not defined
})(undefined, 1);
```

所以，在使用默认参数的时候，需要注意参数之间的关联顺序，只能顺着来。

### class的TDZ

在使用class继承的时候需要注意一点：**如果需要在子类的`constructor`方法里面使用`this`的话，必须先调用`super();`** 。

还是因为TDZ，子类的this在调用父类的构造函数之前一直都是未初始化的，尝试访问便会报错。

# 后话

ES6引入TDZ的机制，很大程度上让JS规矩了许多，对JS初学者也更友好了。

V8在将来的版本可能会引入一个`use strong`的模式，这种模式比严格模式更严格，在该模式下尝试访问一个对象不存在的属性不再返回`undefined`了，而会报错，看起来和TDZ机制出发点是一样的。

两者都是为了规范代码，让一些意想不到的异常情况变成错误的形式早点暴露出来，同时也让程序的运行结果变得更符合预期。
