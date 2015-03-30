function* generateNaturalNumber() {
    var i = 0;
    while(i <= 100) {
        yield i;
        i++;
    }
}

for(var i in generateNaturalNumber()) {
    console.log(i);
}

function createNaturalNumber() {
    var i = 0;
    return {
        next: function next() {
            return {done: i >= 100, value: i++};
        }
    };
}
for(var i in createNaturalNumber()) {
    console.log(i);
}

function* generateNaturalNumber() {
    console.log('function start');
    var i = 0;
    while(i <= 100) {
        console.log('yield start');
        yield i;
        console.log('yield end');
        i++;
    }
    console.log('function end');
}
var result = generateNaturalNumber();

function* generateNaturalNumber() {
    var i = 0;
    while(i <= 100) {
        var j = yield i;
        j && (i = j);
        i++;
    }
}

function* genFun1() {
    yield 2;
    yield 3;
    yield 4;
}
function* genFun2() {
    yield 1;
    yield* genFun1();
    yield 5;
}
for(var i of genFun2()) {
    console.log(i);
}

function* genFun2() {
    yield 1;
    yield* [2, 3, 4];
    yield 5;
}
for(var i of genFun2()) {
    console.log(i);
}