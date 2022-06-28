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
            onClick: () => {
                if ($storage.get("top")) {
                    $router.to($route('list/Folders_top'))
                } else {
                    $router.to($route('list/Folders_list'))
                }
            }
        },
        {
            title: '关注列表',
            route: $route('list/Follows')
        },
        {
            title: '我的记录',
            route: $route('record/record')
        },
        {
            style: 'article',
            title: '介绍',
            summary: `关注列表 - 支持UP主搜索\n历史 - 支持观看历史搜索\nUP视频详情页 - 支持视频搜索\n收藏夹 - 只支持list列表时视频搜索（当前${top ? "topTab" : "list"}）`
        }
    ]
}