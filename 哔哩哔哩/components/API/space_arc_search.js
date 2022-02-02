const axios = require("axios");

module.exports = space_arc_search;

/**
 * 获取用户视频学习
 * @param {Number} mid 用户mid
 * @param {String} order 排序
 * @param {Number} page 页数
 * @returns {Object}
 */
async function space_arc_search(mid, order, page) {
    var url = 'https://api.bilibili.com/x/space/arc/search';
    var params = {
        mid: mid,
        ps: 30,
        tid: 0, // 0全部 3音乐 129舞蹈 160生活 217动物圈
        pn: page,
        keyword: '',
        order: order, // pubdate: 最新发布, click: 最多播放, stow: 最多收藏
        jsonp: 'jsonp'
    }
    try {
        var res = await axios.get(url, {
            params: params,
            headers: {
                'referer': 'https://space.bilibili.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
        });
    } catch {
        console.log("请求错误！");
        return false;
    }
    return res.data.data.list.vlist;
}