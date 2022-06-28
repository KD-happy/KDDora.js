module.exports = {
    type: 'topTab',
    tabMode: 'fixed',
    items: [
        {
            title: '登录记录',
            route: $route('record/login_log')
        },
        {
            title: '硬币记录',
            route: $route('record/coin_log')
        },
        {
            title: '经验记录',
            route: $route('record/exp_log')
        }
    ]
}