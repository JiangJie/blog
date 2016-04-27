'use strict';

// import 'babel-polyfill';

// [].includes(0);

// [for(x of [1, 2, 3]) x * x];

// x **= y;

// Object.values({});

// Object.entries({});

// const Test = {
//     a() {},
//     b() {
//         console.log(::this.a)
//     }
// }

// const {a, b, ...c} = {a: 1, b: 2, c: 3, d: 4};

// const obj = {a: 1, b: 2, c: 3, d: 4}
// let a
// let b
// const c = {}
// for(const key in obj) {
//     if(key === 'a') a = obj[key]
//     else if(key === 'b') b = obj[key]
//     else c[key] = obj[key]
// }

// function subObjectInclude(obj, ...keys) {
//     const {[...keys]} = obj;
// }
// subObjectInclude({}, 'a', 'b');

const obj = {a: 1, b: 2, c: 3, d: 4}
console.log(Object.values(obj))
console.log(new Map(Object.entries(obj)).keys())