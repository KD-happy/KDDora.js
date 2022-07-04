const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    title: '历史列表',
    async fetch({page, args}) {
        var data = []
        var pd = false
        page = page || 1;
        this.title = `历史列表 - ${args.keyword}`
        await api.history_search(page, args.keyword, cookie).then(res => {
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
                                    title: '更多操作',
                                    options: [
                                        { value: 'pubdate', title: '最新发布: pubdate' },
                                        { value: 'click', title: '最多播放: click' },
                                        { value: 'stow', title: '最多收藏: stow' },
                                        { value: 'like', title: '点赞' },
                                        { value: 'add', title: '投币' },
                                        { value: 'deal', title: '收藏视频' }
                                    ]
                                })
                                if (selected != null) {
                                    if (selected.value == 'pubdate' || selected.value == 'click' || selected.value == 'stow') {
                                        $router.to($route('list/space_video', {
                                            mid: f.author_mid, order: selected.value
                                        }))
                                    } else if (selected.value == 'like') {
                                        api.archive_like(cookie, csrf, null, f.history.bvid, 1).then(res => {
                                            if (res.data.code == 0) {
                                                $ui.toast("点赞成功");
                                            } else {
                                                $ui.toast(res.data.message)
                                            }
                                        })
                                    } else if (selected.value == 'add') {
                                        let pd = await $input.confirm({
                                            title: "投币",
                                            message: "是否投币",
                                            okBtn: '确定'
                                        })
                                        if (pd) {
                                            api.coin_add(cookie, csrf, null, f.history.bvid, 1, 0).then(res => {
                                                if (res.data.code == 0) {
                                                    $ui.toast("投币成功")
                                                } else {
                                                    $ui.toast(res.data.message)
                                                }
                                            })
                                        } else {
                                            $ui.toast("取消投币")
                                        }
                                    } else if (selected.value == 'deal') {
                                        let list = await api.folder_created_list_all(mid, cookie)
                                        let selected = await $input.select({
                                            title: '选择收藏位置',
                                            options: list
                                        })
                                        if (selected != null) {
                                            api.resource_deal(cookie, csrf, f.kid, selected.id, true).then(res => {
                                                if (res.data.code == 0) {
                                                    $ui.toast("收藏成功")
                                                } else {
                                                    $ui.toast(res.data.message)
                                                }
                                            })
                                        } else {
                                            $ui.toast("取消收藏")
                                        }
                                    }
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