'use strict';

exports.request = async(options) => {
    try {
        const url = options.url;
        delete options.url;

        let res = await fetch(url, options);
        console.log(res);

        res = await res.blob();
        console.log(res);
    } catch (e) {
        console.log(e);
    }
};