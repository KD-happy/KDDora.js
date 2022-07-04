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
                                await pcslad(f.kid, f.history.bvid, f.author_mid, 0, true, true)
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