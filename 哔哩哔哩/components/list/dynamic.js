const dynamic_history = require("../API/dynamic_history");
const dynamic_new = require("../API/dynamic_new");

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
                    title: 'UP视频排列顺序',
                    options: [
                        { value: 'pubdate', title: '最新发布: pubdate' },
                        { value: 'click', title: '最多播放: click' },
                        { value: 'stow', title: '最多收藏: stow' }
                    ]
                })
                if (selected != null) {
                    $router.to($route('list/space_video', {
                        mid: card.owner.mid, order: selected.value
                    }))
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
        if (dynamic_id == 0) {
            var cards = await dynamic_new(mid, cookie);
            if (cards != false) {
                var data = getBeautiful(cards);
                if (data.length < 20) {
                    return {
                        items: data
                    }
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
        dynamic_id = 0;
    }
}