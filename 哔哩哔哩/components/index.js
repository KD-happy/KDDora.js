module.exports = {
    type: 'bottomTab',
    title: '哔哩哔哩',
    async fetch() {
        return [
            {
                title: '首页',
                image: $assets("home.svg"),
                route: $route("list")
            },
            {
                title: '我的',
                image: $assets("mine.svg"),
                route: $route("mine")
            }
        ]
    }
}