*If it is too strong, then you are too weak.*

# 就算是背景吧
随着ES2015的到来，JavaScript引进了许多新特性，很多很强大的特性完全可以弥补JS本身语法上的弱点，比如让很多初次尝试JS的程序员感到不习惯的变量提升问题、没有块级作用域问题等问题。

# strong mode
ES5增加了`strict mode`，现在V8又实现了一种新的模式——`strong mode`。
`strong mode`是`strict mode`的升级版，在语法要求上更严格了，同时正因为这些严格的要求，让开发者得以规避语言本身一些糟粕或者让人困惑的地方。

# 开启strong mode
跟开启strict一样，js文件第一行或者function第一行加上`'use strong';`，
使用--strong_mode标志位，需要Chrome Cancry或者iojs v2.0以及上。
!!!注意了：如果iojs使用--use_strong标志位，将开启全局strong，不管代码里有没有'use strong;'，一律当作strong mode运行，因此很有可能伤及nodejs本身的模块和第三方不支持strong mode的模块，同样的--use_strict也是全局开启strict模式，都请慎用。

# strong mode有哪些改变
下面将涉及到一些ES2015的新特性，这里不做详细讲解，感兴趣的读者可以关注后续ES2015系列相关文章。

### Deprecate sloppy equality
废弃了==和!=两个比较操作符，强制使用===和!==。
避免了一些意想不到的结果，大家都懂的。
```javascript
'use strong';

if (1 == 1);
```
node --strong_mode example.js
```
if (1 == 1);
      ^^
SyntaxError: Please don't use '==' or '!=' in strong mode, use '===' or '!==' instead
```

### Deprecate 'var'
废弃了var关键字，变量声明使用const或者let。
const和let不存在变量提升的问题，也可以创造块级作用域。
```javascript
'use strong';

var name = 'alloyteam';
```
node --strong_mode example.js
```
var name = 'alloyteam';
^^^
SyntaxError: Please don't use 'var' in strong mode, use 'let' or 'const' instead
```

### Deprecate 'delete'
废弃了delete操作符，需要delete的地方可以使用set或者map的delete，可能数据结构需要改变。
```javascript
'use strong';

const obj = {
    name: 'alloyteam'
};
delete obj.name;
```
node --strong_mode example.js
```
delete obj.name;
           ^^^^
SyntaxError: Please don't use 'delete' in strong mode, use maps or sets instead
```

可以这样解决
```javascript
'use strong';

const obj = new Map([
    ['name', 'alloyteam']
]);

obj.delete('name');
```

### Deprecate empty sub-statements
像`if (expression);`这样的空子语句的写法会报错了。
```javascript
'use strong';

if (1 === 1);
```
node --strong_mode example.js
```
if (1 === 1);
            ^
SyntaxError: Please don't use empty sub-statements in strong mode, make them explicit with '{}' instead
```

### Deprecate for-in
废弃了`for-in`遍历，可以使用`for-of`替代。
for-in对对象属性进行遍历，for-of对可迭代的对象进行遍历。
for-in存在[诸多问题][for-in]，如果非要遍历对象，可以使用Object.keys(obj)拿到对象的属性列表，然后进行数组遍历。
```javascript
'use strong';

const obj = {
    name: 'alloyteam'
};
for (let k in obj) {
    console.log(k, obj[k]);
}
```
node --strong_mode example.js
```
for (let k in obj) {
           ^^
SyntaxError: Please don't use 'for'-'in' loops in strong mode, use 'for'-'of' instead
```

可以这样解决
```javascript
'use strong';

const obj = new Map([
    ['name', 'alloyteam']
]);

for (let item of obj) {
    console.log(item[0], item[1]);
}
```

### Deprecate 'arguments'
函数体内不能再使用arguments变量，可以使用...args替代。
```javascript
'use strong';

function test() {
    console.log(arguments);
}
```
node --strong_mode example.js
```
    console.log(arguments);
                ^^^^^^^^^
SyntaxError: Please don't use 'arguments' in strong mode, use '...args' instead
```

可以这样解决
node --strong_mode --harmony-rest-parameters example.js
```javascript
'use strong';

function test(...args) {
    console.log(args);
}
```

[for-in]: http://www.infoq.com/cn/articles/es6-in-depth-iterators-and-the-for-of-loop