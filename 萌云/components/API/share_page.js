const axios = require("axios");

module.exports = share_page;

/**
 * 分享链接列表
 * @param {Number} page 分享页面
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function share_page(page, cookie) {
    var url = `https://moecloud.cn/api/v3/share?page=${page}&order_by=created_at&order=DESC`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var parames = {
        page: page,
        order_by: "created_at",
        order: "DESC"
    };
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
        console.log("请求失败！");
        return false;
    }
    if (res.data.code == 0) {
        return res.data.data;
    } else {
        return false;
    }    
}