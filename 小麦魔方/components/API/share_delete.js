const axios = require("axios");

module.exports = share_delete;

/**
 * 删除分享链接
 * @param {String} key 分享key
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function share_delete(key, cookie) {
    var url = `https://mo.own-cloud.cn/api/v3/share/${key}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://mo.own-cloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    try {
        var res = await axios({
            method: "DELETE",
            url: url,
            headers: headers
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    return res.data.code == 0;
}