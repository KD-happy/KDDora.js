const API = require("../API/API");
const api = API();

module.exports = {
    type: 'list',
    title: '用户搜索列表',
    async fetch({page, args}) {
        var data = []
        page = page || 1;
        this.title = `用户搜索列表 - ${args.keyword}`
        await api.followings_search(mid, page, args.keyword, cookie).then(res => {
            console.log('JSON.stringify(res.data)',JSON.stringify(res.data))
            if (res.data.data == null) {
                data.push({
                    style: 'article',
                    title: '加载错误',
                    summary: `${res.data.message}\n有可能Cookie已失效`
                })
            } else {
                res.data.data.list.forEach(f => {
                    data.push({
                        style: 'live',
                        author: {
                            name: f.uname,
                        },
                        label: `关注于 ${formateTimeStamp(f.mtime*1000)}`,
                        title: f.sign,
                        image: f.face,
                        route: $route('list/space_video', {
                            mid: f.mid,
                            order: 'pubdate'
                        }),
                        onLongClick: async () => {
                            await pcs(f.mid)
                        }
                    })
                })
                if (data.length == 0 && page == 1) {
                    data.push({
                        style: 'article',
                        title: '搜索为空',
                        summary: `当前关键字 ${args.keyword} 没有该用户`
                    })
                }
            }
        })
        if (data.length < 20) {
            return data;
        } else {
            return {
                nextPage: page + 1,
                items: data
            }
        }
    },
    beforeCreate() {
        getCookie();
    }
}