const axios = require("axios");
const cheerio = require("cheerio");

var title;

async function detail_more(url) {
    var data = [];
    var res = await axios.get(url);
    var $ = cheerio.load(res.data);
    var more_url = all_url + $('.detail-more').attr('href');
    res = await axios.get(more_url);
    $ = cheerio.load(res.data);
    title = $('title').text();
    var li = $('ul.detail-list-select > li > a');
    for (var i=0; i<li.length; i++) {
        data.push({
            style: 'label',
            title: li.eq(i).text(),
            route: $route('read', {
                url: all_url + li.eq(i).attr('href')
            })
        })
    }
    return data.reverse();
}

module.exports = {
    type: 'list',
    async fetch({args}) {
        var data = await detail_more(args.url);
        this.title = title;
        return data;
    }
}