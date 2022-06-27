const w_live_users = require("../API/w_live_users");

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
        var list = await w_live_users(0, cookie);
        if (list.count > 0) {
            list = await w_live_users(list.count, cookie);
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
                        let selected = await $input.select({
                            title: 'UP视频排列顺序',
                            options: [
                                {value: 'pubdate', title: '最新发布: pubdate'},
                                {value: 'click', title: '最多播放: click'},
                                {value: 'stow', title: '最多收藏: stow'}
                            ]
                        })
                        if (selected != null) {
                            console.log(m.upper)
                            $router.to($route('list/space_video', {
                                mid: m.uid, order: selected.value
                            }))
                        }
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