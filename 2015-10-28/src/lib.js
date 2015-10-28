'use strict';

exports.request = async(options) => {
    try {
        const res = await fetch(options.url, options);
        console.log(res);
    } catch (e) {
        console.log(e);
    }
};