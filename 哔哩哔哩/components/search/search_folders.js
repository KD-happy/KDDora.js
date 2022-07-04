const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    async fetch({args, page}) {
        this.searchRoute = $route('list/Folder', args)
        this.title = `收藏夹搜索 - ${args.keyword}`
        page = page || 1;
        var list = await api.resource_list(page, args.id, args.keyword, order, cookie);
        var data = []
        if (list && list.medias!=null) {
            list.medias.forEach(m => {
                data.push({
                    style: 'live',
                    author: {
                        name: m.upper.name,
                        avatar: m.upper.face
                    },
                    label: formateTimeStamp(m.fav_time*1000),
                    title: m.title,
                    image: m.cover,
                    viewerCount: m.cnt_info.play,
                    route: $route(`bilibili://video/${m.bvid}`),
                    onLongClick: async () => {
                        await pcslad(m.id, m.bvid, m.upper.mid, 0, false)
                    }
                })
            })
            if (list.has_more) {
                return {
                    nextPage: page + 1,
                    items: data
                }
            } else {
                return data;
            }
        }
        return [{
            style: 'article',
            title: '搜索为空',
            summary: `当前关键字 ${args.keyword} 在当前收藏夹不存在`
        }];
    },
    beforeCreate() {
        getCookie();
    }
}