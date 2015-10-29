最近在着手把手上的Nodejs代码全面升级到strong模式，strong模式是V8实现的一种新的模式，主要的变化我在[前面的文章](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/)中已经写过。

# 从报错开始

然而事情并没有想象中顺利，将所有文件第一行的'use strict'换成'use strong'之后，一运行，立马出现一个报错`TypeError: In strong mode, accessing missing property 'NODE_ENV' of #<Object> is deprecated`。

查看代码发现是这行
```
const isProduction = process.env.NODE_ENV === 'production';
```

看起来似乎是很莫名其妙的错误，就换了个模式而已，好端端的代码怎么报这样一个闻所未闻见所未见的奇葩错误呢？

然而我已决定深究下去，将错误信息翻译过来就是，`在strong模式下，访问对象不存在的属性已被废弃，而且会报TypeError的错误`。

看到strong mode下的报错可以断定是V8引起的了，但是网上关于strong mode的介绍确实没有提起过这个变化。

于是我在V8的源码里面找了一圈，果然很快在[头文件messages.h](https://chromium.googlesource.com/v8/v8/+/refs/heads/lkgr/src/messages.h)找到这行
```
T(StrongPropertyAccess, "In strong mode, accessing missing property '%' of % is deprecated")
```
>为了方便说明，下文就将这个变化点叫做StrongPropertyAccess。

等等，看到这句话是不是很伤心。访问不存在的属性？JS程序员不是天天都干这事吗？这也会报错？简直颠覆三观。

相信几乎所有写过JS的都有写过类似这样的代码，特别在处理默认值的时候肯定会这样写

假设这是一行在处理ajax请求的默认方法的代码
```
var type = option.method || 'GET';
```

如果option没有method这个属性（或者getter），那么顺理成章的，type的值就是'GET'。
但是，在strong模式下，这行代码行不通了，而且会报错，这不是完全颠覆了我们的代码习惯了吗。

看来V8这是要彻底改变我们的编码习惯啊。

# undefined并不是真的undefined

网上对StrongPropertyAccess也是议论纷纷，有支持的也有反对的，但我没找到官方对StrongPropertyAccess这样改的详细理由。

猜测的话，可能是为了避免这种易混淆情况
```
var obj = {
    a: undefined
};
obj.a // undefined
obj.b // undefined
```
先温习一下访问对象obj的属性a的过程：
>如果obj确实有属性a，则返回a的值；如果obj没有属性a，则自底而上查找原型链上的对象，直到找到属性a并返回，否则直到原型链最顶层（通常是Object.prototype）也没找到属性a，则返回undefined。

这时候在访问obj的属性a和b的时候表现是一样的，如果没看到代码，我们很可能会认为属性a和b都不存在，但事实上属性a是存在的。这种代码就容易造成混淆，而StrongPropertyAccess就很好的区分开了这两种情况，在访问属性b的时候就会报错。

另外值得一提的是，TypeScript在编译阶段就会认为这是一种错误。

诚然，strong mode避免了这样的混淆，不过同时也让JS丧失了一些灵活性。

strong mode的诞生，很大程度上是为了提升V8性能来的，但StrongPropertyAccess在性能方面，从代码和原理方面来理解的话似乎不会有所提升。

但如果选择了strong mode，就得适应新的编码习惯。

# 新的习惯

再看看这段代码，假设在处理ajax请求的timeout参数
```
var option = {
    timeout: 0
};
var timeout = option.timeout || 1000;
```
这段代码的想法可能是，接受参数传的timeout的值，如果没传则默认是1秒。
但是由于疏忽，忘了考虑传0的情况（timeout等于0意味着没有超时机制），这样的话0就永远无法生效。

代码应该改成这样
```
var timeout = 'timeout' in option ? option.timeout : 1000;
```
这里只讨论timeout要么没传值，要么是合法值的情况。

用ES2015的话，有种更优雅的写法
```
var {timeout = 1000} = option;
```
这就是解构赋值的语法，跟
```
var timeout = 'timeout' in option ? option.timeout : 1000;
```
完全等价

再废话一句吧，ES2015是趋势，新的语法简洁清晰，虽然现在支持的环境并不多，不过[搭配babel可以转换成主流环境都支持的语法](http://www.alloyteam.com/2015/08/its-time-to-use-es2015/)。