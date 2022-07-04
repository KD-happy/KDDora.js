const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    async fetch({page, args}) {
        page = page || 1;
        if (args.all) { // 显示全部
            if (args.attention) {
                var list = await api.relation_followings(mid, page, "attention", cookie);
            } else {
                var list = await api.relation_followings(mid, page, "", cookie);
            }
            var data = list.map(m => {
                return {
                    style: 'live',
                    author: {
                        name: m.uname,
                    },
                    label: `关注于 ${formateTimeStamp(m.mtime*1000)}`,
                    title: m.sign,
                    image: m.face,
                    route: $route('list/space_video', {
                        mid: m.mid,
                        order: 'pubdate'
                    }),
                    onLongClick: async () => {
                        await pcs(m.mid)
                    }
                }
            })
        } else {
            var list = await api.relation_tag(mid, args.tagid, page, cookie);
            var data = list.map(m => {
                return {
                    style: 'live',
                    author: {
                        name: m.uname,
                    },
                    title: m.sign,
                    image: m.face,
                    route: $route('list/space_video', {
                        mid: m.mid,
                        order: 'pubdate'
                    }),
                    onLongClick: async () => {
                        await pcs(m.mid)
                    }
                }
            })
        }
        if (data.length < 20) {
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