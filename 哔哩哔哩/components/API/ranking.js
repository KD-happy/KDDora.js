const axios = require("axios");

module.exports = ranking;

/**
 * 获取排行
 * @param {Number} rid 排行类型视频
 * @param {String} type 类型
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function ranking(rid, type, cookie) {
    var url = "https://api.bilibili.com/x/web-interface/ranking/v2?rid=168&type=all";
    var headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
        'cookie': cookie
    }
    var params = {
        'rid': rid,
        'type': type
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
        return res.data.data.list;
    } else {
        return false;
    }
}