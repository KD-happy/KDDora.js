const axios = require("axios");
const cheerio = require("cheerio");

var title, actions;

async function get_images(url) {
    var res = await axios.get(url);
    var $ = cheerio.load(res.data);
    var script = $('script');
    title = $('h1.title').text();
    var comic_name = all_url + $('.comic-name').attr('href');
    var prev = all_url + $('.prev').attr('href');
    var next = all_url + $('.next').attr('href');
    var data = [];
    for (var i=0; i<script.length; i++) {
        if (script.eq(i).html().includes('km5_img_url')) {
            var km5_img_url = /km5_img_url='(.*)'/.exec(script.eq(i).html())[1];
        }
    }
    if (km5_img_url != undefined) {
        var imgs_url = JSON.parse(new Buffer.from(km5_img_url, 'base64').toString());
        var content = "";
        imgs_url.forEach(f => {
            content += `<img src="${/\d{1,2}\|(.*)/.exec(f)[1]}" width="100%" />`
        });
        data.push({
            title: '阅读',
            style: 'richContent',
            content: {
                html: content
            }
        })
        data.push({
            title: '上一章',
            style: 'label',
            route: $route('read', {
                url: prev
            })
        })
        data.push({
            title: '目录',
            style: 'label',
            route: $route('mulu', {
                url: comic_name
            })
        })
        data.push({
            title: '下一章',
            style: 'label',
            route: $route('read', {
                url: next
            })
        })
        actions = [];
        actions.push({
            title: '下一章',
            onClick: () => {
                $router.to($route('read', {
                    url: next
                }))
            }
        })
        actions.push({
            title: '目录',
            onClick: () => {
                $router.to($route('mulu', {
                    url: comic_name
                }))
            }
        })
        actions.push({
            title: '上一章',
            onClick: () => {
                $router.to($route('read', {
                    url: prev
                }))
            }
        })
    }
    return data;
}

module.exports = {
    type: 'list',
    async fetch({args}) {
        var data = await get_images(args.url);
        this.title = title;
        this.actions = actions;
        return data;
    }
}
