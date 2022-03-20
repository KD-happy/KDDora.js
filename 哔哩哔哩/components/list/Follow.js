const relation_followings = require("../API/relation_followings");
const relation_tag = require("../API/relation_tag");

module.exports = {
    type: 'list',
    async fetch({page, args}) {
        page = page || 1;
        if (args.all) { // 显示全部
            if (args.attention) {
                var list = await relation_followings(mid, page, "attention", cookie);
            } else {
                var list = await relation_followings(mid, page, "", cookie);
            }
            var data = list.map(m => {
                return {
                    style: 'live',
                    author: {
                        name: m.uname,
                    },
                    label: `关注于 ${formateTimeStamp(m.mtime*1000)}`,
                    title: m.sign,
                    image: m.face,
                    route: $route('list/space_video', {
                        mid: m.mid,
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
                                mid: m.mid, order: selected.value
                            }))
                        }
                    }
                }
            })
        } else {
            var list = await relation_tag(mid, args.tagid, page, cookie);
            var data = list.map(m => {
                return {
                    style: 'live',
                    author: {
                        name: m.uname,
                    },
                    title: m.sign,
                    image: m.face,
                    route: $route('list/space_video', {
                        mid: m.mid,
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
                                mid: m.mid, order: selected.value
                            }))
                        }
                    }
                }
            })
        }
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