const info = require("../API/info");
const arc_search = require("../API/arc_search");

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
            var info2 = await info(args.mid);
            author = {
                name: info2.name,
                avatar: info2.face
            }
            this.title = `${titles[args.order]}: ${author.name}`;
        }
        var data = []
        await arc_search(args.mid, page, args.keyword, args.order, cookie).then(res => {
            res.data.data.list.vlist.forEach(f => {
                data.push({
                    style: 'live',
                    author: author,
                    label: `${formateTimeStamp(f.created*1000)}`,
                    title: f.title,
                    image: f.pic,
                    viewerCount: f.play,
                    route: $route(`bilibili://video/${f.bvid}`)
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