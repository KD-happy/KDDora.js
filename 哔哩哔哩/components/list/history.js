const API = require("../API/API");
const api = API();

var params;

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 历史',
    searchRoute: $route('search/search_historys'),
    async fetch({page}) {
        if (page) {
            page = page
        } else {
            page = 1
            params = {
                'max': '',
                'view_at': '',
                'business': ''
            }
        }
        var history = await api.history_cursor(params, cookie).then(res => {
            return res.data.code == 0 ? res.data.data : false;
        })
        if (history != false) {
            params = history.cursor;
            var data = [];
            history.list.forEach(m => {
                if (m.history.business == "archive") {
                    data.push({
                        style: 'live',
                            author: {
                                name: m.author_name,
                                avatar: m.author_face
                            },
                            label: formateTimeStamp(m.view_at*1000),
                            title: m.title,
                            image: m.cover,
                            route: $route(`bilibili://video/${m.history.bvid}`),
                            onLongClick: async () => {
                                await pcslad(m.kid, m.history.bvid, m.author_mid, 0, true, true)
                            }
                    })
                }
            })
            if (history.list.length < 20) {
                return data;
            } else {
                return {
                    nextPage: page + 1,
                    items: data
                }
            }
        }
    },
    beforeCreate() {
        getCookie();
    }
}