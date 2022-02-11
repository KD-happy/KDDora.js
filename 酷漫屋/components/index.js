module.exports = {
    type: 'bottomTab',
    async fetch() {
        return [
            {
                title: '首页',
                image: $icon('home'),
                route: $route('home')
            },
            {
                title: '分类',
                image: $icon('view_module'),
                route: $route('fl')
            },
            {
                title: '排行',
                image: $icon('format_line_spacing'),
                route: $route('ph')
            },
            {
                title: '收藏',
                image: $icon('my_location'),
                route: $route('follow')
            }
        ]
    }
}
