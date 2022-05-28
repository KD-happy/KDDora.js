const API = require("./API");
var api = API(cookie);

module.exports = {
    type: 'list',
    title: '微博视频号 - 播放列表',
    beforeCreate() {
        getCookie()
        api = API(cookie)
    },
    async fetch() {
        var data = [], style = $storage.get('style')
        if (style) {
            data.push({
                style: 'category',
                title: '全部视频，分类视频，点赞过的视频',
                action: {
                    title: '切换样式',
                    onClick: () => {
                        $storage.put('style', !style)
                        $ui.toast("切换成功")
                    }
                }
            })
        }
        UID.forEach(f => {
            json = {
                style: 'category',
                title: f.name
            }
            if (data.length == 0) {
                json.action = {
                    title: '切换样式',
                    onClick: () => {
                        $storage.put('style', !style)
                        $ui.toast("切换成功")
                    }
                }
            }
            if (!style) {
                data.push(json)
            }
            data.push({
                style: 'icon',
                title: style ? f.name : "全部视频",
                summary: "全部视频",
                thumb: f.avatar,
                spanCount: 4,
                onClick: () => {
                    $router.to($route('list/alllist', f))
                }
            })
            
            data.push({
                style: 'icon',
                title: style ? f.name : "分类视频",
                summary: "分类视频",
                thumb: f.avatar,
                spanCount: 4,
                onClick: () => {
                    if (top) {
                        $router.to($route('list/taglistTop', f))
                    } else {
                        $router.to($route('list/taglist', f))
                    }
                }
            })
            data.push({
                style: 'icon',
                title: style ? f.name : "点赞过的视频",
                summary: "点赞过的视频",
                thumb: f.avatar,
                spanCount: 4,
                onClick: () => {
                    $router.to($route('list/likelist', f))
                }
            })
        })
        return data
    }
}