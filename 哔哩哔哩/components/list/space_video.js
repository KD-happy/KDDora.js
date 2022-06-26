const info = require("../API/info");
const space_arc_search = require("../API/space_arc_search");

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
            var info2 = await info(args.mid);
            author = {
                name: info2.name,
                avatar: info2.face
            }
            this.title = `${titles[args.order]}: ${author.name}`;
        }
        var list = await space_arc_search(args.mid, args.order, page);
        var data = list.map(m => {
            return {
                style: 'live',
                author: author,
                label: `${formateTimeStamp(m.created*1000)}`,
                title: m.title,
                image: m.pic,
                viewerCount: m.play,
                route: $route(`bilibili://video/${m.bvid}`)
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