const fs = require("fs");

async function get(keyword) {
    var videos = $storage.get("videos");
    if (videos == null) {
        $ui.toast("请刷新搜索");
        return [];
    } else {
        var returns = [];
        var reg = new RegExp(keyword, 'i');
        videos.forEach(m => {
            if (reg.test(m.title)) {
                returns.push({
                    style: 'vod',
                    title: m.title,
                    label: m.meta,
                    thumb: m.img_url,
                    route: $route("dd_js", {
                        title: m.title,
                        url: m.url
                    })
                })
            }
        })
        if (returns.length == 0) {
            $ui.toast("搜索为空");
        }
        return returns;
    }
}

module.exports = {
    type: 'list',
    async fetch({args}) {
        var data = await get(args.keyword);
        this.title = `搜索 ${args.keyword} 如下:`;
        return data;
    }
}