const axios = require("axios");
const cheerio = require("cheerio");

var have_next=true;

async function get_mh_item(url) {
    var data = [];
    var res = await axios.get(url);
    var $ = cheerio.load(res.data);
    var mh_item = $('.mh-item');
    for (var i=0; i<mh_item.length; i++) {
        /star-(\d)/.exec("mh-star-line star-4")[1]
        data.push({
            style: 'vod',
            title: $('.title', mh_item.eq(i)).text(),
            thumb: /url\((.*)\)/.exec($('.mh-cover', mh_item.eq(i)).attr('style'))[1],
            label: $('.chapter', mh_item.eq(i)).text(),
            summary: `评分: ${/star-(\d)/.exec(($('.mh-star-line', mh_item.eq(i)).attr('class')))[1]}`,
            route: $route('mulu', {
                url: all_url + $('a', mh_item.eq(i)).attr('href')
            }),
            onLongClick: async () => {
                let pd = await $input.confirm({
                    title: '是否收藏',
                    message: '收藏',
                    okBtn: '收藏'
                })
                if (pd) {
                    var follows = $storage.get('follows');
                    if (follows == null) {
                        follows = [];
                    }
                    follows.push(await get_info(all_url + $('a', mh_item.eq(i)).attr('href')));
                    $storage.put('follows', follows);
                    $ui.toast("收藏成功");
                } else {
                    $ui.toast("取消收藏");
                }
            }
        })
    }
    var page_li = $('.page-pagination > li');
    for (var j=0; j<page_li.length; j++) {
        page_li.eq(j).has('.active') && j+1==page_li.length ? have_next=false : null;
    }
    return data;
}

module.exports = {
    type: 'list',
    async fetch({ args, page }) {
        page = page || 1;
        this.title = args.title;
        var url = `${all_url}/rank/${args.id}-${page}.html`;
        var data = await get_mh_item(url);
        if (have_next) {
            return {
                nextPage: page+1,
                items: data
            }
        } else {
            return data;
        }
    }
}
