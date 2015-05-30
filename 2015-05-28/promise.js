'use strict';

var Promise = require('bluebird');
(function() {
    // 记录Promise链的长度
    var i = 0;
    function run() {
        return new Promise(function(resolve) {
            // 每增加10000个Promise打印一次内存使用情况
            if (i % 10000 === 0) console.log(process.memoryUsage());
            i++;
            // 模拟一个异步操作
            setImmediate(function() {
                // 100000个Promise之后退出
                if(i === 10000 * 10) return resolve();
                // 如果resolve的参数是一个Promise，外层Promise将接管这个Promise的状态，构成嵌套Promise
                resolve(run());
            });
        }).then(function() {}).done();
    }
    run();
})();

// (function() {
//     var i = 0;
//     function run() {
//         var p = new Promise(function(resolve) {
//             if (i % 10000 === 0) {
//                 global.gc();
//                 console.log(process.memoryUsage());
//             }
//             i++;
//             setImmediate(function() {
//                 resolve(run());
//             });
//         }).then(function() {});

//         return new Promise(function() {
//             return p;
//         });
//     }
//     run();
// })();