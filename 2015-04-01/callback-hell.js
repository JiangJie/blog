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

function* genFun() {
    yield 1;
    return 2;
} 