const API = require("../API");
var api = API(cookie);

module.exports = {
    type: 'list',
    title: '微博视频号 - 播放列表',
    beforeCreate() {
        getCookie()
        api = API(cookie)
    },
    async fetch({args}) {
        var data = []
        this.title = `${args.name} -- 单人列表`
        data.push({
            style: 'icon',
            title: "全部视频",
            summary: "全部视频",
            thumb: args.avatar,
            spanCount: 4,
            onClick: () => {
                $router.to($route('list/alllist', args))
            }
        })
        data.push({
            style: 'icon',
            title: "分类视频",
            summary: "分类视频",
            thumb: args.avatar,
            spanCount: 4,
            onClick: () => {
                if (top) {
                    $router.to($route('list/taglistTop', args))
                } else {
                    $router.to($route('list/taglist', args))
                }
            }
        })
        data.push({
            style: 'icon',
            title: "点赞过的视频",
            summary: "点赞过的视频",
            thumb: args.avatar,
            spanCount: 4,
            onClick: () => {
                $router.to($route('list/likelist', args))
            }
        })
        return data
    }
}