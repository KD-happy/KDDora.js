const fs = require("fs");
const Refresh = require("./Refresh");

async function get(page) {
    var videos = $storage.get("videos");
    var returns = [];
    for (var i=(page-1)*20; i<page*20 && i<videos.length; i++) {
        returns.push(videos[i]);
    }
    return returns;
}

module.exports = {
    type: 'list',
    searchRoute: $route('search'),
    actions: [
        {
            title: "刷新搜索",
            onClick: async () => {
                Refresh();
            }
        }
    ],
    async fetch({args, page}) {
        page = page || 1;
        var list = await get(page);
        var data = list.map(m => {
            return {
                style: 'vod',
                title: m.title,
                label: m.meta,
                thumb: m.img_url
            }
        })
        if (data.length < 20) {
            return data;
        } else {
            return {
                nextPage: page+1,
                items: data
            }
        }
    }
}