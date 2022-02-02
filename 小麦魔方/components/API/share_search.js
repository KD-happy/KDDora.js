const axios = require("axios");

module.exports = share_search;

/**
 * 搜索分享
 * @param {String} keyword 搜索关键字
 * @param {Number} page 搜索页数
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function share_search(keyword, page, cookie) {
    var url = `https://mo.own-cloud.cn/api/v3/share/search?page=${page}&order_by=created_at&order=DESC&keywords=${encodeURIComponent(keyword)}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://mo.own-cloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    // 分享晚早, 分享早晚, 下载大小, 下载小大, 浏览大小, 浏览小大
    var type = [
        {"order_by": "created_at", "order": "DESC"},
        {"order_by": "created_at", "order": "ASC"},
        {"order_by": "downloads",  "order": "DESC"},
        {"order_by": "downloads",  "order": "ASC"},
        {"order_by": "views",      "order": "DESC"},
        {"order_by": "views",      "order": "ASC"}
    ]
    try {
        var res = await axios.get(url, {
            headers: headers
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    if (res.data.code == 0) {
        return res.data.data.items;
    } else {
        return false;
    }
}