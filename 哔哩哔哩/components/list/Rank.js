const ranking = require("../API/ranking");

module.exports = {
    type: 'list',
    async fetch({args}) {
        rid = args.rid;
        var list = await ranking(args.rid, args.type, cookie);
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
                    await pcslad(m.aid, m.bvid, m.owner.mid, 0, true)
                }
            }
        })
        return data;
    },
    beforeCreate() {
        getCookie();
    }
}