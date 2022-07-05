const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
    type: 'article',
    async fetch({args}) {
        await this.get_images(this._url || args.url);
        return {
            content: {
                html: this.data
            }
        };
    },
    async get_images(url) {
        var res = await axios.get(url);
        var $ = cheerio.load(res.data);
        var script = $('script');
        title = $('h1.title').text();
        this.title = title
        var comic_name = all_url + $('.comic-name').attr('href');
        var prev = all_url + $('.prev').attr('href');
        var next = all_url + $('.next').attr('href');
        for (var i=0; i<script.length; i++) {
            if (script.eq(i).html().includes('km5_img_url')) {
                var km5_img_url = /km5_img_url='(.*)'/.exec(script.eq(i).html())[1];
            }
        }
        if (km5_img_url != undefined) {
            var imgs_url = JSON.parse(new Buffer.from(km5_img_url, 'base64').toString());
            this.data = "";
            imgs_url.forEach(f => {
                this.data += `<img src="${/\d{1,2}\|(.*)/.exec(f)[1]}" width="100%" />`
            });
            actions = [];
            actions.push({
                title: '下一章',
                onClick: () => {
                    set_url(next);
                    this._url = next
                    this.refresh()
                    // $router.to($route('read', {
                    //     url: next
                    // }))
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
                    set_url(prev);
                    this._url = prev
                    this.refresh()
                    // $router.to($route('read', {
                    //     url: prev
                    // }))
                }
            })
            this.actions = actions
        }
    }
}
