module.exports = {
    type: 'bottomTab',
    async fetch() {
        return [
            {
                title: '首页',
                image: $assets('home.svg'),
                route: $route('home')
            },
            {
                title: '关注',
                image: $assets('follows.svg'),
                route: $route('follows')
            }
        ]
    }
}
