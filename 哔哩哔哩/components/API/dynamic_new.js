const axios = require("axios");

module.exports = dynamic_new;

/**
 * 动态信息 -- 第一次请求
 * @param {Number} mid 用户mid
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function dynamic_new(mid, cookie) {
    var url = "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new";
    var params = {
        'uid': mid,
        'type_list': 8,
        'from': '',
        'platform': 'web'
    }
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
        return res.data.data.cards;
    } else {
        return false;
    }
}