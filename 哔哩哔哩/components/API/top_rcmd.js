const axios = require("axios");

module.exports = top_rcmd;

/**
 * 首页换一换
 * @param {Number} fresh_type 刷新类型 未知 3
 * @param {Number} version 版本 未知 1
 * @param {Number} ps 一页显示数量 8
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function top_rcmd(fresh_type, version, ps, cookie) {
    var url = `https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3&version=1&ps=8`;
    var headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
        'cookie': cookie
    }
    try {
        var res = await axios.get(url, {
            headers: headers
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    return res.data.data.item;
}