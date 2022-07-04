const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 稍后再看',
    async fetch() {
        var data = []
        // data.push({
        //     style: 'label',
        //     title: 
        // })
        await api.history_toview(cookie).then(res => {
            let viewed = 0, view = 0
            res.data.data.list.forEach(f => {
                if (f.viewed) {
                    viewed += 1
                } else {
                    view += 1
                }
            })
            data.push({
                style: 'article',
                title: '简介',
                summary: `看完的视频: ${viewed}   未看完的视频: ${view}`
            })
            res.data.data.list.forEach(f => {
                data.push({
                    style: 'live',
                    author: {
                        name: f.owner.name,
                        avatar: f.owner.face
                    },
                    label: formateTimeStamp(f.ctime*1000),
                    title: f.viewed ? `${f.title} *` : f.title,
                    image: f.pic,
                    viewerCount: f.stat.view,
                    route: $route(`bilibili://video/${f.bvid}`),
                    onLongClick: async () => {
                        await pcslad(f.aid, f.bvid, f.owner.mid, 0, true, false)
                    }
                })
            })
        })
        return data;
    },
    beforeCreate() {
        getCookie();
    }
}