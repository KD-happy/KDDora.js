const followings_search = require("../API/followings_search");

module.exports = {
    type: 'list',
    title: '用户搜索列表',
    async fetch({page, args}) {
        var data = []
        page = page || 1;
        this.title = `用户搜索列表 - ${args.keyword}`
        await followings_search(mid, page, args.keyword, cookie).then(res => {
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
                                    mid: f.mid, order: selected.value
                                }))
                            }
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