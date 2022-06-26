const axios = require("axios");

/**
 * 历史搜索
 * @param {Number} pn 页数
 * @param {String} keyword 搜索关键字
 * @param {String} cookie Cookie
 * @returns {Promise}
 */
module.exports = async function history_search(pn, keyword, cookie) {
    var params = {
        pn: pn,
        keyword: keyword,
        business: 'all',
    }
    return axios.get('https://api.bilibili.com/x/web-goblin/history/search', {
        params: params,
        headers: {
            'cookie': cookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
}