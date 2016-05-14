![Timer](http://www.alloyteam.com/wp-content/uploads/2016/05/timer.jpg)

# 从JS执行机制说起

浏览器（或者说JS引擎）执行JS的机制是基于事件循环。

由于JS是单线程，所以同一时间只能执行一个任务，其他任务就得排队，后续任务必须等到前一个任务结束才能开始执行。

为了避免因为某些长时间任务造成的无意义等待，JS引入了异步的概念，用另一个线程来管理异步任务。

同步任务直接在主线程队列中顺序执行，而异步任务会进入另一个任务队列，不会阻塞主线程。等到主线程队列空了（执行完了）的时候，就会去异步队列查询是否有可执行的异步任务了（异步任务通常进入异步队列之后还要等一些条件才能执行，如ajax请求、文件读写），如果某个异步任务可以执行了便加入主线程队列，以此循环。

# JS定时器

JS的定时器目前有三个：`setTimeout`、`setInterval`和`setImmediate`。

定时器也是一种异步任务，通常浏览器都有一个独立的定时器模块，定时器的延迟时间就由定时器模块来管理，当某个定时器到了可执行状态，就会被加入主线程队列。

JS定时器非常实用，做动画的肯定都用到过，也是最常用的异步模型之一。

有时候一些奇奇怪怪的问题，加一个setTimeout(fn, 0)（以下简写`setTimeout(0)`）就解决了。不过，如果对定时器本身不熟悉，也会产生一些奇奇怪怪的问题。

### setTimeout

setTimeout(fn, x)表示延迟x毫秒之后执行fn。

使用的时候千万不要太相信预期，延迟的时间严格来说总是大于x毫秒的，至于大多少就要看当时JS的执行情况了。

另外，多个定时器如不及时清除（clearTimeout），会存在干扰，使延迟时间更加捉摸不透。所以，不管定时器有没有执行完，及时清除已经不需要的定时器是个好习惯。

HTML5规范规定最小延迟时间不能小于4ms，即x如果小于4，会被当做4来处理。
不过不同浏览器的实现不一样，比如，Chrome可以设置1ms，IE11/Edge是4ms。

setTimeout注册的函数fn会交给浏览器的定时器模块来管理，延迟时间到了就将fn加入主进程执行队列，如果队列前面还有没有执行完的代码，则又需要花一点时间等待才能执行到fn，所以实际的延迟时间会比设置的长。如在fn之前正好有一个超级大循环，那延迟时间就不是一丁点了。
```javascript
(function testSetTimeout() {
    const label = 'setTimeout';
    console.time(label);
    setTimeout(() => {
        console.timeEnd(label);
    }, 10);
    for(let i = 0; i < 100000000; i++) {}
})();
```
结果是：`setTimeout: 335.187ms`，远远不止10ms。

### setInterval

setInterval的实现机制跟setTimeout类似，只不过setInterval是重复执行的。

对于setInterval(fn, 100)容易产生一个误区：并不是上一次fn执行完了之后再过100ms才开始执行下一次fn。
事实上，setInterval并不管上一次fn的执行结果，而是每隔100ms就将fn放入主线程队列，而两次fn之间具体间隔多久就不一定了，跟setTimeout实际延迟时间类似，和JS执行情况有关。
```javascript
(function testSetInterval() {
    let i = 0;
    const start = Date.now();
    const timer = setInterval(() => {
        i += 1;
        i === 5 && clearInterval(timer);
        console.log(`第${i}次开始`, Date.now() - start);
        for(let i = 0; i < 100000000; i++) {}
        console.log(`第${i}次结束`, Date.now() - start);
    }, 100);
})();
```
输出
```javascript
第1次开始 100
第1次结束 1089
第2次开始 1091
第2次结束 1396
第3次开始 1396
第3次结束 1701
第4次开始 1701
第4次结束 2004
第5次开始 2004
第5次结束 2307
```
可见，虽然每次fn执行时间都很长，但下一次并不是等上一次执行完了再过100ms才开始执行的，实际上早就已经等在队列里了。

另外可以看出，当setInterval的回调函数执行时间超过了延迟时间，已经完全看不出有时间间隔了。

如果setTimeout和setInterval都在延迟100ms之后执行，那么谁先注册谁就先执行回调函数。

### setImmediate
这算一个比较新的定时器，目前IE11/Edge支持、Nodejs支持，Chrome不支持，其他浏览器未测试。

从API名字来看很容易联想到setTimeout(0)，不过setImmediate应该算是setTimeout(0)的替代版。

在IE11/Edge中，setImmediate延迟可以在1ms以内，而setTimeout有最低4ms的延迟，所以setImmediate比setTimeout(0)更早执行回调函数。不过在Nodejs中，两者谁先执行都有可能，原因是Nodejs的事件循环和浏览器的略有差异。

```javascript
(function testSetImmediate() {
    const label = 'setImmediate';
    console.time(label);

    setImmediate(() => {
        console.timeEnd(label);
    });
})();
```
Edge输出：`setImmediate: 0.555 毫秒`

很明显，setImmediate设计来是为保证让代码在下一次事件循环执行，以前setTimeout(0)这种不可靠的方式可以丢掉了。

# 其他常用异步模型

### requestAnimationFrame

requestAnimationFrame并不是定时器，但和setTimeout很相似，在没有requestAnimationFrame的浏览器一般都是用setTimeout模拟。

requestAnimationFrame跟屏幕刷新同步，大多数屏幕的刷新频率都是60Hz，对应的requestAnimationFrame大概每隔16.7ms触发一次，如果屏幕刷新频率更高，requestAnimationFrame也会更快触发。基于这点，在支持requestAnimationFrame的浏览器还使用setTimeout做动画显然是不明智的。

在不支持requestAnimationFrame的浏览器，如果使用setTimeout/setInterval来做动画，最佳延迟时间也是16.7ms。
如果太小，很可能连续两次或者多次修改dom才一次屏幕刷新，这样就会丢帧，动画就会卡；如果太大，显而易见也会有卡顿的感觉。

有趣的是，第一次触发requestAnimationFrame的时机在不同浏览器也存在差异，Edge中，大概16.7ms之后触发，而Chrome则立即触发，跟setImmediate差不多。按理说Edge的实现似乎更符合常理。
```javascript
(function testRequestAnimationFrame() {
    const label = 'requestAnimationFrame';
    console.time(label);

    requestAnimationFrame(() => {
        console.timeEnd(label);
    });
})();
```
Edge输出：`requestAnimationFrame: 16.66 毫秒`

Chrome输出：`requestAnimationFrame: 0.698ms`

但相邻两次requestAnimationFrame的时间间隔大概都是16.7ms，这一点是一致的。当然也不是绝对的，如果页面本身性能就比较低，相隔的时间可能会变大，这就意味着页面达不到60fps。

### Promise

Promise是很常用的一种异步模型，如果我们想让代码在下一个事件循环执行，可以选择使用`setTimeout(0)`、`setImmediate`、`requestAnimationFrame(Chrome)`和`Promise`。

而且Promise的延迟比setImmediate更低，意味着Promise比setImmediate先执行。
```javascript
function testSetImmediate() {
    const label = 'setImmediate';
    console.time(label);

    setImmediate(() => {
        console.timeEnd(label);
    });
}

function testPromise() {
    const label = 'Promise';
    console.time(label);
    new Promise((resolve, reject) => {
        resolve();
    }).then(() => {
        console.timeEnd(label);
    });
}

testSetImmediate();
testPromise();
```
Edge输出：`Promise: 0.33 毫秒`
          `setImmediate: 1.66 毫秒`

尽管setImmediate的回调函数比Promise先注册，但还是Promise先执行。

可以肯定的是，在各JS环境中，Promise都是最先执行的，setTimeout(0)、setImmediate和requestAnimationFrame顺序不确定。

### process.nextTick

process.nextTick是Nodejs的API，比Promise更早执行。

事实上，process.nextTick是不会进入异步队列的，而是直接在主线程队列尾强插一个任务，虽然不会阻塞主线程，但是会阻塞异步任务的执行，如果有嵌套的process.nextTick，那异步任务就永远没机会被执行到了。

使用的时候要格外小心，除非你的代码明确要在本次事件循环结束之前执行，否则使用setImmediate或者Promise更保险。