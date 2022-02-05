const axios = require("axios");
const cheerio = require("cheerio");

async function getUp(u) {
    var url = `https://www.acfun.cn/u/${u}`;
    var res = await axios.get(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
        }
    })
    var $ = cheerio.load(res.data);
    var space_video = $('.ac-space-video');
    var data = [];
    for (var i=0; i<space_video.length; i++) {
        var eq = space_video.eq(i);
        var ac = JSON.parse(eq.attr('data-wbinfo')).mediaId;
        var img_url = $('.video img', eq).attr('src');
        var title = $('.title.line', eq).text();
        var play_info = $('.play-info', eq).text();
        var date = $('.date', eq).text();
        data.push({
            ac: ac,
            img_url: img_url,
            title: title,
            play_info: play_info,
            date: date
        })
    }
    return data;
}

module.exports = {
    type: 'list',
    async fetch({args}) {
        var list = await getUp(args.up);
        var data = list.map(m => {
            return {
                style: 'live',
                title: m.title,
                image: m.img_url,
                route: $route("video", {
                    ac: m.ac
                })
            }
        })
        return data;
    }
}