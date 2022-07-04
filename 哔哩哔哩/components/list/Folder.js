const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    async fetch({args, page}) {
        this.searchRoute = $route('search/search_folders', args)
        page = page || 1;
        var list = await api.resource_list(page, args.id, "", order, cookie);
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
                        await pcslad(m.id, m.bvid, m.upper.mid, args.id, false, true)
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
        } else {
            return [{
                style: 'article',
                title: '警告',
                summary: `当前收藏夹没有任何内容（或 加载失败）`
            }]
        }
    },
    beforeCreate() {
        getCookie();
    }
}