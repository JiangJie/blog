'use strict';

function loop10(n = 1) {
    // const N = 10 ** n;
    const N = Math.pow(10, n);
    for(let i = 0; i < N; i++) {}
}

function testSetTimeout() {
    const label = 'setTimeout';
    console.time(label);
    setTimeout(() => {
        console.timeEnd(label);
    });
}

function testSetInterval() {
    let i = 0;
    const start = Date.now();
    const timer = setInterval(() => {
        i += 1;
        i === 5 && clearInterval(timer);
        console.log(`第${i}次开始`, Date.now() - start);
        loop10(8);
        console.log(`第${i}次结束`, Date.now() - start);
    }, 100);
}

// let i = 0;
// function testRequestAnimationFrame() {
//     const label = 'requestAnimationFrame';
//     // console.time(label);
//     const ts = Date.now();
//     requestAnimationFrame(() => {
//         if(i === 10) return;
//         i += 1;

//         // console.timeEnd(label);
//         console.log(Date.now() - ts);

//         testRequestAnimationFrame();
//     });
// }

function testRequestAnimationFrame() {
    const label = 'requestAnimationFrame';
    console.time(label);

    requestAnimationFrame(() => {
        console.timeEnd(label);
    });
}

// function testSetImmediate() {
//     const label = 'setImmediate';
//     console.time(label);

//     setImmediate(() => {
//         console.timeEnd(label);
//     });
// }

function testPromise() {
    const label = 'promise';
    console.time(label);
    new Promise((resolve, reject) => {
        resolve();
    }).then(() => {
        console.timeEnd(label);
    });
}

// function testNexttick() {
//     const label = 'nextTick';
//     console.time(label);

//     process.nextTick(() => {
//         console.timeEnd(label);
//     });
// }

testRequestAnimationFrame();
// testSetImmediate();
testSetTimeout();
// testSetInterval();
testPromise();
// testNexttick();