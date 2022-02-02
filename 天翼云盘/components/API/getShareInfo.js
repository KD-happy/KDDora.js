const axios = require("axios");

module.exports = getShareInfo;

/**
 * 获取分享信息
 * @param {String} shareId 分享id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function getShareInfo(shareId, cookie) {
    var url = "https://cloud.189.cn/api/portal/getShareInfo.action";
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var params = {
        shareId: shareId
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
    if (res.data.res_code != null) {
        return res.data;
    } else {
        return false;
    }
}