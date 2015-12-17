(async () => {
    try {
        // 获取用户名
        // const name = await $.ajax('get_my_name');
        // 根据用户名获取个人信息
        // const info = await $.ajax(`get_my_info_by_name'?name=${name}`);
        // console.log(info);

        return Promise.resolve('hello world');
    } catch(err) {
        console.error(err);
    }
})().then((...args) => {
    console.log(args);
});

async function asyncFun1() {}
async function asyncFun2() {
    await asyncFun1();
}
async function asyncFun3() {
    await asyncFun2();
}
asyncFun3();

React.createClass({
    getInitialState() {
        return {info: {}};
    },
    componentDidMount() {
        // 获取用户名
        $.ajax('get_my_name')
        .then(name => {
            // 根据用户名获取个人信息
            // 链式Promise
            return $.ajax(`get_my_info_by_name'?name=${name}`);
        }).then(info => {
            this.setSate({info});
        }).catch(err => {
            console.error(err);
        });
    },
    render() {
        // render info
    }
});

componentDidMount() {
    const self = this;
    // 获取用户名
    $.ajax('get_my_name')
    .then(name => {
        // 根据用户名获取个人信息
        // 链式Promise
        return $.ajax(`get_my_info_by_name'?name=${name}`);
    }).then(function(info) {
        self.setSate({info});
    }).catch(function(err) => {
        console.error(err);
    });
}

async componentDidMount() {
    try {
        // 获取用户名
        const name = await $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = await $.ajax(`get_my_info_by_name'?name=${name}`);
        this.setSate({info});
    } catch(err) {
        console.error(err);
    }
}