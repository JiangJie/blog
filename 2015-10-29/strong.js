'use strong';

// const obj = {
//     a: 1
// };

// const o1 = Object.create(obj);

// console.log(o1.a);

// o1.b = 2;
// console.log(o1.b);

const obj = {
    get a() {
        return 100;
    }
};

console.log('a' in obj);

const o1 = {
    a: obj.a || 1
};

console.log(o1);