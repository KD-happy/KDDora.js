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
                    let selected = await $input.select({
                        title: 'UP视频排列顺序',
                        options: [
                            {value: 'pubdate', title: '最新发布: pubdate'},
                            {value: 'click', title: '最多播放: click'},
                            {value: 'stow', title: '最多收藏: stow'}
                        ]
                    })
                    if (selected != null) {
                        $router.to($route('list/space_video', {
                            mid: m.owner.mid, order: selected.value
                        }))
                    }
                }
            }
        })
        return data;
    },
    beforeCreate() {
        getCookie();
    }
}