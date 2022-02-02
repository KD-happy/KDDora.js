const axios = require("axios");

module.exports = popular;

/**
 * 获取热门
 * @param {Number} page 页数
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function popular(page, cookie) {
    var url = `https://api.bilibili.com/x/web-interface/popular?ps=20&pn=${page}`;
    var res = await axios.get(url, {
        headers: {
            "cookie": cookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    });
    return res.data.data.list;
}