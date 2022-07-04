const API = require("../API/API");
const api = API();

var dynamic_id;

function getBeautiful(cards) {
    var data = cards.map(m => {
        var card = JSON.parse(m.card, null, );
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
                await pcslad(card.aid, null, card.owner.mid, 0, true, true)
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
            var cards = await api.dynamic_new(mid, cookie);
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
            var cards = await api.dynamic_history(mid, dynamic_id, cookie);
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