const axios = require("axios");
const cheerio = require('cheerio');

var go = true;

async function getVideoInfo(url, page) { // url 最好以/结尾
    console.log(url, page);
    if (page != 1) {
        url += `page/${page}/`;
    }
    var res = await axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    });
    var $ = cheerio.load(res.data);
    // console.log($('.post-box-container').length);
    if($('.next.page-numbers').length >= 1) {
        go = true;
    } else {
        go = false;
    }
    var arr = [];
    $('.post-box-container').each((i, m) => {
        var thumb = $('.post-box-image', m).attr('style');
        thumb = /.*\((.*)\)/g.exec(thumb)[1];
        var label = $('.post-box-meta', m).text();
        var tags = [];
        $('.post-box-meta a', m).each((i, m) => {
            var json = {
                title: $(m).text(),
                url: $(m).attr('href')
            }
            tags.push(json);
        })
        var title = $('.post-box-title', m).text();
        var video_url = $('.post-box-title > a', m).attr('href');
        var summary = $('.post-box-text > p', m).text();
        var json = {
            thumb: thumb,
            label: label,
            tags: tags,
            title: title,
            video_url: video_url,
            summary: summary
        }
        arr.push(json);
    });
    return arr;
}

module.exports = {
    type: 'list',
    async fetch({page, args}) {
        page = page || 1;
        this.title = args.title;
        var arr = await getVideoInfo(args.url, page);
        var data = arr.map(m => {
            return {
                style: 'vod',
                thumb: m.thumb,
                label: m.label,
                title: m.title,
                summary: m.summary,
                route: $route('dd_js', {
                    title: m.title,
                    url: m.video_url
                }),
                // onLongClick: async () => {
                //     let selected = await $input.select({
                //         title: '分区查看',
                //         options: m.tags
                //     })
                //     if (selected != null) {
                //         $router.to($route('dd_js', {
                //             url: selected.url
                //         }))
                //     }
                // }
            }
        })
        if (go) {
            return {
                nextPage: page + 1,
                items: data
            }
        } else {
            return data;
        }
    }
}