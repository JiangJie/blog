asyncFun1(function(err, a) {
    // do something with a in function 1
    asyncFun2(function(err, b) {
        // do something iwith b n function 2
        asyncFun3(function(err, c) {
            // do something with c in function 3
        });
    });
});

function fun3(err, c) {
    // do something with a in function 3
}
function fun2(err, b) {
    // do something with b in function 2 
    asyncFun3(fun3);
}
function fun1(err, a) {
    // do something with a in function 1
    asyncFun2(fun2);
}
asyncFun1(fun1);

asyncFun1().then(function(a) {
    // do something with a in function 1
    asyncFun2();
}).then(function(b) {
    // do something with b in function 2
    asyncFun3();
}).then(function(c) {
    // do somethin with c in function 3
});

async.series([
    function(callback) {
        // do some stuff ...
        callback(null, 'one');
    },
    function(callback) {
        // do some more stuff ...
        callback(null, 'two');
    }
],
// optional callback
function(err, results) {
    // results is now equal to ['one', 'two']
});

co(function*() {
    var a = yield asyncFun1();
    var b = yield asyncFun2(a);
    var c = yield asyncFun3(b);
    // do somethin with c
})();

function co(genFun) {
    // 通过调用生成器函数得到一个生成器
    var gen = genFun();
    return function(fn) {
        next();
        function next(err, res) {
            if(err) return fn(err);
            // 将res传给next，作为上一个yield的返回值
            var ret = gen.next(res);
            // 如果函数还没迭代玩，就继续迭代
            if(!ret.done) return ret.value(next);
            // 返回函数最后的值
            fn && fn(null, res);
        }
    }
}

function parallel(callback) {
    var processed = 0;
    var res = [];

    asyncFun1(function(err, a) {
        if(err) return callback(err);

        processed += 1;
        res[0] = a;
        if(processed === 3) callback(null, res);
    });
    asyncFun2(function(err, b) {
        if(err) return callback(err);

        processed += 1;
        res[1] = b;
        if(processed === 3) callback(null, res);
    });
    asyncFun3(function(err, c) {
        if(err) return callback(err);

        processed += 1;
        res[2] = c;
        if(processed === 3) callback(null, res);
    });
}

co(function*() {
    var res = yield [asyncFun1(), asyncFun2(), asyncFun3()];
    // do something with res
})();

var newArr = arr.map(co.wrap(function*(item) {
    return yield asyncFun(item);
}));

stream.on('data', co.wrap(function*() {
    yield asyncFun(item);
}));