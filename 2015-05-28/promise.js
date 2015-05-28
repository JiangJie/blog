'use strict';

var Promise = require('bluebird');

(function() {
    var i = 0;

    function run() {
        return new Promise(function(resolve) {
            if (i % 10000 === 0) {
                global.gc();
                console.log(process.memoryUsage());
            }
            i++;
            setImmediate(resolve);
        }).then(run).done();
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
//             setImmediate(resolve);
//         }).then(run);

//         var p2 = new Promise(function() {
//             return p;
//         });

//         return p2;
//     }

//     run();
// })();

// (function() {
//     var i = 0;

//     function run() {
//         new Promise(function(resolve) {
//             if (i % 10000 === 0) {
//                 global.gc();
//                 console.log(process.memoryUsage());
//             }
//             i++;
//             setImmediate(resolve);
//         }).then(run);
//     }

//     run();
// })();