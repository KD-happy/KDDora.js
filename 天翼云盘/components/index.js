module.exports = {
    type: 'bottomTab',
    title: "天翼云盘",
    searchRoute: $route('list_search'),
    async fetch() {
        return [
            {
                title: '全部文件',
                image: $assets("home.svg"),
                route: $route('list', {id: -11, title: "全部文件"})
            },
            {
                title: '用户配置',
                image: $assets("mine.svg"),
                route: $route('userConfig')
            }
        ]
    }
}
