const axios = require("axios");

module.exports = relation_tags;

/**
 * 获取关注标签
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function relation_tags(cookie) {
    var url = "https://api.bilibili.com/x/relation/tags";
    var params = {
        jsonp: 'jsonp'
    }
    try {
        var res = await axios.get(url, {
            params: params,
            headers: {
                'cookie': cookie,
                'referer': 'https://space.bilibili.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
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