const axios = require("axios");
const cheerio = require("cheerio");

async function getTag(tag, page) {
    var url = `https://www.acfun.cn/v/${tag}/index.htm`;
    var res = await axios.get(url, {
        params: {
            page: page
        },
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
        }
    })
    var $ = cheerio.load(res.data);
    var list = $('.list-content-item');
    var data = [];
    for (var i=0; i<list.length; i++) {
        var up_name = $('.list-content-uplink', list.eq(i)).attr('title');
        var viewCount = $('.viewCount', list.eq(i)).text();
        var commentCount = $('.commentCount', list.eq(i)).text();
        var img_url = $('.list-content-cover', list.eq(i)).attr('src');
        var video_time = $('.video-time', list.eq(i)).text();
        var ac = JSON.parse($('.list-content-top', list.eq(i)).attr('data-wbinfo')).mediaId;
        var title = $('.list-content-title', list.eq(i)).text();
        data.push({
            up_name: up_name,
            viewCount: viewCount,
            commentCount: commentCount,
            img_url: img_url,
            video_time: video_time,
            ac: ac,
            title: title
        })
    }
    return data;
}

module.exports = {
    type: 'list',
    async fetch({args, page}) {
        page = page || 1;
        var list = await getTag(args.tag, page);
        var data = list.map(m => {
            return {
                style: 'live',
                title: m.title,
                author: {
                    name: m.up_name
                },
                image: m.img_url,
                route: $route("video", {
                    ac: m.ac
                })
            }
        })
        console.log(data)
        if (data.length < 30) {
            return data;
        } else {
            return {
                nextPage: page+1,
                items: data
            }
        }
    }
}