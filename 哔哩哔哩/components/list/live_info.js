const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 直播间',
    actions: [
        {
            title: '直播间号',
            onClick: async () => {
                let rid = await $input.number({
                    title: '输入直播房间号',
                    hint: '房间号',
                    value: ''
                })
                $router.to($route('list/live', {
                    rid: rid
                }))
            }
        }
    ],
    async fetch() {
        var list = await api.w_live_users(0, cookie).then(res => {
            return res.data.data;
        })
        if (list.count > 0) {
            list = await api.w_live_users(list.count, cookie).then(res => {
                return res.data.data;
            });
            var data = list.items.map(m => {
                return {
                    style: 'live',
                    author: {
                        name: m.uname,
                    },
                    title: m.title,
                    image: m.face,
                    route: $route('list/live', {
                        rid: /(\d+)/g.exec(m.link)[0]
                    }),
                    onLongClick: async () => {
                        await pcs(m.uid)
                    }
                }
            })
            return data;
        } else {
            $ui.toast("当前没有直播");
        }
    },
    beforeCreate() {
        getCookie();
    }
}