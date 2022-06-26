const axios = require("axios");

/**
 * 搜索视频
 * @param {String} mid 用户Mid
 * @param {Number} pn 页数
 * @param {String} keyword 关键字
 * @param {String} order 排序
 * @param {String} cookie Cookie
 * @returns {Promise}
 */
module.exports = async function arc_search(mid, pn, keyword, order, cookie) {
    var params = {
        mid: mid,
        ps: 30,
        tid: 0,
        pn: pn,
        keyword: keyword,
        order: order,
    }
    return axios.get('https://api.bilibili.com/x/space/arc/search', {
        params: params,
        headers: {
            'cookie': cookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
}