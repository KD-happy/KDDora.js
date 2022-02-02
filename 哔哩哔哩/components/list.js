module.exports = {
    type: 'list',
    items: [
        {
            title: '推送',
            route: $route('list/dynamic')
        },
        {
            title: '历史',
            route: $route('list/history')
        },
        {
            title: '排行',
            route: $route('list/Ranks')
        },
        {
            title: '每周必看',
            route: $route('list/Series_list')
        },
        {
            title: '热门',
            route: $route('list/popular')
        },
        {
            title: '直播间',
            route: $route('list/live_info')
        },
        {
            title: '收藏夹',
            route: $route('list/Folders')
        },
        {
            title: '关注列表',
            route: $route('list/Follows')
        }
    ]
}