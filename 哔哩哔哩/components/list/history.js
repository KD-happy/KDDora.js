const history_cursor = require("../API/history_cursor")

var params;

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 历史',
    searchRoute: $route('search/search_historys'),
    async fetch({page}) {
        var history = await history_cursor(params, cookie);
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
                                let selected = await $input.select({
                                    title: 'UP视频排列顺序',
                                    options: [
                                        {value: 'pubdate', title: '最新发布: pubdate'},
                                        {value: 'click', title: '最多播放: click'},
                                        {value: 'stow', title: '最多收藏: stow'}
                                    ]
                                })
                                if (selected != null) {
                                    $router.to($route('list/space_video', {
                                        mid: m.author_mid, order: selected.value
                                    }))
                                }
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
        params = {
            'max': '',
            'view_at': '',
            'business': ''
        };
    }
}