const axios = require("axios");
const cheerio = require('cheerio');
const fs = require("fs");

module.exports = Refresh;

var json = [];

async function get_next(url) {
    var res = await axios.get(url=url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
    var $ = cheerio.load(res.data);
    var article = $('.post-box-list article');
    for (var i=0; i<article.length; i++) {
        var url = article.eq(i).attr('data-href');
        var img_url = /\((.*)\)/g.exec($('.post-box-image', article.eq(i)).attr('style'))[1];
        var meta = $('.post-box-meta', article.eq(i)).text();
        var title = $('.post-box-title', article.eq(i)).text();
        json.push({
            title: title,
            meta: meta,
            url: url,
            img_url: img_url
        })
    }
    console.log(`当前页: ${$('.page-numbers.current').text()}`);
    return $('.next.page-numbers').attr('href');
}

async function Refresh() {
    var url = "https://ddrk.me/";
    var i = 0;
    do {
        url = await get_next(url.toString());
        i += 1;
    } while (url != undefined);
    $ui.toast("刷新成功");
    $storage.put("videos", json);
}