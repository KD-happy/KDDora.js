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
        var data = []
        data.push({title: "左边全部视频，右边分类视频",style: 'category'})
        UID.forEach(f => {
            data.push({
                style: 'icon',
                title: f.name,
                summary: "单点全部，长按分类",
                thumb: f.avatar,
                spanCount: 6,
                onClick: () => {
                    $router.to($route('list/alllist', f))
                }
            })
            data.push({
                style: 'icon',
                title: f.name,
                summary: "单点全部，长按分类",
                thumb: f.avatar,
                spanCount: 6,
                onClick: () => {
                    if (top) {
                        $router.to($route('list/taglistTop', f))
                    } else {
                        $router.to($route('list/taglist', f))
                    }
                }
            })
        })
        return data
    }
}