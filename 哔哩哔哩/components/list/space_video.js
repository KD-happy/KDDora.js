const API = require("../API/API");
const api = API();

var titles = {
    pubdate: '最新发布',
    click: '最多播放',
    stow: '最多收藏'
}

module.exports = {
    type: 'list',
    async fetch({page, args}) {
        page = page || 1;
        this.searchRoute = $route('search/search_videos', args)
        if (author.name == undefined) {
            var info = await api.info(args.mid).then(res => {
                return res.data.data;
            })
            author = {
                name: info.name,
                avatar: info.face
            }
            this.title = `${titles[args.order]}: ${author.name}`;
        }
        var list = await api.space_arc_search(args.mid, args.order, page).then(res => {
            return res.data.data.list.vlist;
        })
        var data = list.map(m => {
            return {
                style: 'live',
                author: author,
                label: `${formateTimeStamp(m.created*1000)}`,
                title: m.title,
                image: m.pic,
                viewerCount: m.play,
                route: $route(`bilibili://video/${m.bvid}`),
                onLongClick: async () => {
                    await lad(m.aid, null, true)
                }
            }
        })
        if (data.length == 30) {
            return {
                nextPage: page + 1,
                items: data
            }
        } else {
            return data;
        }
    },
    beforeCreate() {
        getCookie();
        author = {};
    }
}