(() => {
    // 获取用户名
    $.ajax('get_my_name')
    .then(name => {
        // 根据用户名获取个人信息
        // 链式Promise
        return $.ajax(`get_my_info_by_name'?name=${name}`);
    }).then(info => {
        console.log(info);
    }).catch(err => {
        console.error(err);
    });
})();


(async () => {
    try {
        // 获取用户名
        const name = $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = $.ajax(`get_my_info_by_name'?name=${name}`);
        console.log(info);
    } catch(err) {
        console.error(err);
    }
})();