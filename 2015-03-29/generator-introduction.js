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