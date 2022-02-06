module.exports = {
    type: 'bottomTab',
    async fetch() {
        return [
            {
                title: '首页',
                image: $assets('首页.svg'),
                route: $route('home')
            },
            {
                title: '关注',
                image: $assets('我的关注.svg'),
                route: $route('follows')
            }
        ]
    }
}
