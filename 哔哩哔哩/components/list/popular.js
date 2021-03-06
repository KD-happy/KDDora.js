const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 热门',
    async fetch({page}) {
        page = page || 1;
        var list = await api.popular(page, cookie).then(res => {
            return res.data.data.list;
        })
        var data = list.map(m => {
            return {
                style: 'live',
                author: {
                    name: m.owner.name,
                    avatar: m.owner.face
                },
                label: m.tname,
                title: m.title,
                image: m.pic,
                viewerCount: m.stat.view,
                route: $route(`bilibili://video/${m.bvid}`),
                onLongClick: async () => {
                    await pcslad(m.aid, m.bvid, m.owner.mid, 0, true, true)
                }
            }
        })
        if (list.length < 20) {
            return data;
        } else {
            return {
                nextPage: page + 1,
                items: data
            }
        }
    },
    beforeCreate() {
        getCookie();
    }
}