const axios = require("axios");

module.exports = history_cursor;

/**
 * 获取历史列表
 * @param {Object} params 请求参数
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function history_cursor(params, cookie) {
    var url = 'https://api.bilibili.com/x/web-interface/history/cursor';
    var headers = {
        'cookie': cookie,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    }
    try {
        var res = await axios.get(url, {
            params: params,
            headers: headers
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    if (res.data.code == 0) {
        return res.data.data;
    } else {
        return false;
    }
}