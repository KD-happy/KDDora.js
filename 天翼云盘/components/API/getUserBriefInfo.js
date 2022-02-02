const axios = require("axios");

module.exports = getUserBriefInfo;

/**
 * 获取简要用户信息
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function getUserBriefInfo(cookie) {
    var url = "https://cloud.189.cn/api/portal/v2/getUserBriefInfo.action";
    var headers = {
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    try {
        var res = await axios.get(url, {
            headers: headers
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    if (res.data.res_code != null) {
        return res.data;
    } else {
        return false;
    }
}