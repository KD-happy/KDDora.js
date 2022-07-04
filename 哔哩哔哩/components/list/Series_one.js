const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 每周必看',
    async fetch({args}) {
        var list = await api.popular_series_one(args.number);
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
        return data;
    },
    beforeCreate() {
        getCookie();
    }
}