const axios = require("axios");
const cheerio = require("cheerio");

async function get_home() {
    var res = await axios.get(all_url);
    var $ = cheerio.load(res.data);
    var data = [];
    data.push({
        style: 'category',
        title: '精选漫画'
    })
    var jxmh = $('li' ,$('.active > ul')[0]);
    for (let i=0; i<jxmh.length; i++) {
        data.push({
            style: 'vod',
            title: $('.title', jxmh.eq(i)).text(),
            thumb: /url\((.*)\)/.exec($('.mh-cover', jxmh.eq(i)).attr('style'))[1],
            label: $('.chapter', jxmh.eq(i)).text(),
            summary: `评分: ${/star-(\d)/.exec(($('.mh-star-line', jxmh.eq(i)).attr('class')))[1]}`,
            route: $route('mulu', {
                url: all_url + $('a', jxmh.eq(i)).attr('href')
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
                    follows.push(await get_info(all_url + $('a', jxmh.eq(i)).attr('href')));
                    $storage.put('follows', follows);
                    $ui.toast("收藏成功");
                } else {
                    $ui.toast("取消收藏");
                }
            }
        })
    }
    data.push({
        style: 'category',
        title: '今日热门'
    })
    var jrrm = $('.swiper-container li');
    for (let i=0; i<jrrm.length; i++) {
        data.push({
            style: 'vod',
            title: $('.cover > a', jrrm.eq(i)).attr('title'),
            thumb: $('img', jrrm.eq(i)).attr('src'),
            label: $('.subtitle', jrrm.eq(i)).text(),
            summary: `评分: ${$('.star > .active').length}`,
            route: $route('mulu', {
                url: all_url + $('a', jrrm.eq(i)).attr('href')
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
                    follows.push(await get_info(all_url + $('a', jxmh.eq(i)).attr('href')));
                    $storage.put('follows', follows);
                    $ui.toast("收藏成功");
                } else {
                    $ui.toast("取消收藏");
                }
            }
        })
    }
    data.push({
        style: 'category',
        title: '最近更新'
    })
    var zjgx = $('#index-update-0 li');
    for (let i=0; i<zjgx.length; i++) {
        data.push({
            style: 'vod',
            title: $('.title', zjgx.eq(i)).text(),
            thumb: /url\((.*)\)/.exec($('.mh-cover', zjgx.eq(i)).attr('style'))[1],
            label: $('.chapter', zjgx.eq(i)).text(),
            summary: `评分: ${/star-(\d)/.exec(($('.mh-star-line', zjgx.eq(i)).attr('class')))[1]}`,
            route: $route('mulu', {
                url: all_url + $('a', zjgx.eq(i)).attr('href')
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
                    follows.push(await get_info(all_url + $('a', jxmh.eq(i)).attr('href')));
                    $storage.put('follows', follows);
                    $ui.toast("收藏成功");
                } else {
                    $ui.toast("取消收藏");
                }
            }
        })
    }
    data.push({
        style: 'category',
        title: '最新上架'
    })
    var zxsj = $('li', $('.index-manga').eq(1));
    for (let i=0; i<zxsj.length; i++) {
        data.push({
            style: 'vod',
            title: $('.title', zxsj.eq(i)).text(),
            thumb: /url\((.*)\)/.exec($('.mh-cover', zxsj.eq(i)).attr('style'))[1],
            label: $('.chapter', zxsj.eq(i)).text(),
            summary: `评分: ${/star-(\d)/.exec(($('.mh-star-line', zxsj.eq(i)).attr('class')))[1]}`,
            route: $route('mulu', {
                url: all_url + $('a', zxsj.eq(i)).attr('href')
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
                    follows.push(await get_info(all_url + $('a', jxmh.eq(i)).attr('href')));
                    $storage.put('follows', follows);
                    $ui.toast("收藏成功");
                } else {
                    $ui.toast("取消收藏");
                }
            }
        })
    }
    data.push({
        style: 'category',
        title: '完结佳作'
    })
    var wjjz = $('li' ,$('.active > ul')[1]);
    for (let i=0; i<wjjz.length; i++) {
        data.push({
            style: 'vod',
            title: $('.title', wjjz.eq(i)).text(),
            thumb: /url\((.*)\)/.exec($('.mh-cover', wjjz.eq(i)).attr('style'))[1],
            label: $('.chapter', wjjz.eq(i)).text(),
            summary: `评分: ${/star-(\d)/.exec(($('.mh-star-line', wjjz.eq(i)).attr('class')))[1]}`,
            route: $route('mulu', {
                url: all_url + $('a', wjjz.eq(i)).attr('href')
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
                    follows.push(await get_info(all_url + $('a', jxmh.eq(i)).attr('href')));
                    $storage.put('follows', follows);
                    $ui.toast("收藏成功");
                } else {
                    $ui.toast("取消收藏");
                }
            }
        })
    }
    return data;
}

module.exports = {
    type: 'list',
    async fetch() {
        this.title = "首页";
        var data = await get_home();
        return data;
    }
}