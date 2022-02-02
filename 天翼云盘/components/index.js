module.exports = {
    type: 'bottomTab',
    title: "天翼云盘",
    searchRoute: $route('list_search'),
    actions: [{title: "分享保存", route: $route("saveList")}],
    async fetch() {
        return [
            {
                title: '全部文件',
                image: $assets("home.svg"),
                route: $route('list', {id: -11, pid: -11, title: "全部文件"})
            },
            {
                title: '用户配置',
                image: $assets("mine.svg"),
                route: $route('userConfig')
            }
        ]
    }
}
