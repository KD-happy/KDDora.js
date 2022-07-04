const dynamic_history = require("../API/dynamic_history");
const dynamic_new = require("../API/dynamic_new");
const archive_like = require("../API/archive_like");
const coin_add = require("../API/coin_add");
const resource_deal = require("../API/resource_deal");
const folder_created_list_all = require("../API/folder_created_list_all");

var dynamic_id;

function getBeautiful(cards) {
    var data = cards.map(m => {
        var card = JSON.parse(m.card);
        dynamic_id = m.desc.dynamic_id_str;
        return {
            style: 'live',
            author: {
                name: card.owner.name,
                avatar: card.owner.face
            },
            label: formateTimeStamp(card.ctime*1000),
            title: card.title,
            image: card.pic,
            viewerCount: card.stat.view,
            route: $route(`bilibili://video/${card.short_link.substring(15)}`),
            onLongClick: async () => {
                let selected = await $input.select({
                    title: '更多操作',
                    options: [
                        { value: 'pubdate', title: '最新发布: pubdate' },
                        { value: 'click', title: '最多播放: click' },
                        { value: 'stow', title: '最多收藏: stow' },
                        { value: 'like', title: '点赞' },
                        { value: 'add', title: '投币' },
                        { value: 'deal', title: '收藏视频' }
                    ]
                })
                if (selected != null) {
                    if (selected.value == 'pubdate' || selected.value == 'click' || selected.value == 'stow') {
                        $router.to($route('list/space_video', {
                            mid: card.owner.mid, order: selected.value
                        }))
                    } else if(selected.value == 'like') {
                        archive_like(cookie, csrf, card.aid, null, 1).then(res => {
                            if (res.data.code == 0) {
                                $ui.toast("点赞成功");
                            } else {
                                $ui.toast(res.data.message)
                            }
                        })
                    } else if (selected.value == 'add') {
                        let pd = await $input.confirm({
                            title: "投币",
                            message: "是否投币",
                            okBtn: '确定'
                        })
                        if (pd) {
                            coin_add(cookie, csrf, card.aid, null, 1, 0).then(res => {
                                if (res.data.code == 0) {
                                    $ui.toast("投币成功")
                                } else {
                                    $ui.toast(res.data.message)
                                }
                            })
                        } else {
                            $ui.toast("取消投币")
                        }
                    } else if (selected.value = 'deal') {
                        let list = await folder_created_list_all(mid, cookie)
                        let selected = await $input.select({
                            title: '选择收藏位置',
                            options: list
                        })
                        if (selected != null) {
                            resource_deal(cookie, csrf, card.aid, selected.id, true).then(res => {
                                if (res.data.code == 0) {
                                    $ui.toast("收藏成功")
                                } else {
                                    $ui.toast(res.data.message)
                                }
                            })
                        } else {
                            $ui.toast("取消收藏")
                        }
                    }
                }
            }
        }
    })
    return data;
}

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 推送',
    async fetch({page}) {
        page = page || 0;
        if (page == 0) {
            dynamic_id = 0
        }
        if (dynamic_id == 0) {
            var cards = await dynamic_new(mid, cookie);
            if (cards != false) {
                var data = getBeautiful(cards);
                if (data.length < 20) {
                    return data;
                } else {
                    return {
                        nextPage: page + 1,
                        items: data
                    }
                }
            }
        } else {
            var cards = await dynamic_history(mid, dynamic_id, cookie);
            if (cards != false) {
                var data = getBeautiful(cards);
                if (data.length < 20) {
                    return data;
                } else {
                    return {
                        nextPage: page + 1,
                        items: data
                    }
                }
            }
        }
    },
    beforeCreate() {
        getCookie();
    }
}