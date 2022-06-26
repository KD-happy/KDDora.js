const history_search = require("../API/history_search");

module.exports = {
    type: 'list',
    title: '历史列表',
    async fetch({page, args}) {
        var data = []
        var pd = false
        page = page || 1;
        this.title = `历史列表 - ${args.keyword}`
        await history_search(page, args.keyword, cookie).then(res => {
            if (res.data.code == 0) {
                pd = res.data.data.has_more
                res.data.data.list != null && res.data.data.list.forEach(f => {
                    if (f.history.business == "archive") {
                        data.push({
                            style: 'live',
                            author: {
                                name: f.author_name,
                                avatar: f.author_face
                            },
                            label: formateTimeStamp(f.view_at*1000),
                            title: f.title,
                            image: f.cover,
                            // viewerCount: card.stat.view,
                            route: $route(`bilibili://video/${f.history.bvid}`),
                            onLongClick: async () => {
                                let selected = await $input.select({
                                    title: 'UP视频排列顺序',
                                    options: [
                                        { value: 'pubdate', title: '最新发布: pubdate' },
                                        { value: 'click', title: '最多播放: click' },
                                        { value: 'stow', title: '最多收藏: stow' }
                                    ]
                                })
                                if (selected != null) {
                                    $router.to($route('list/space_video', {
                                        mid: f.author_mid, order: selected.value
                                    }))
                                }
                            }
                        })
                    }
                })
                if (data.length == 0 && page == 1) {
                    data.push({
                        style: 'article',
                        title: '搜索为空',
                        summary: `当前关键字 ${args.keyword} 没有观看历史`
                    })
                }
            }
        })
        console.log('JSON.stringify(data)',JSON.stringify(data))
        if (pd) {
            return {
                nextPage: page + 1,
                items: data
            }
        } else {
            return data;
        }
    }
}