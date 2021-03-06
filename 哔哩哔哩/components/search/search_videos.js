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
        console.log('JSON.stringify(args)',JSON.stringify(args))
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
        var data = []
        await api.arc_search(args.mid, page, args.keyword, args.order, cookie).then(res => {
            res.data.data.list.vlist.forEach(f => {
                data.push({
                    style: 'live',
                    author: author,
                    label: `${formateTimeStamp(f.created*1000)}`,
                    title: f.title,
                    image: f.pic,
                    viewerCount: f.play,
                    route: $route(`bilibili://video/${f.bvid}`),
                    onLongClick: async () => {
                        await lad(f.aid, null, true)
                    }
                })
            })
            if (data.length == 0 && page == 1) {
                data.push({
                    style: 'article',
                    title: '搜索为空',
                    summary: `当前关键字 ${args.keyword} 该UP主（${author.name}）没有该视频`
                })
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