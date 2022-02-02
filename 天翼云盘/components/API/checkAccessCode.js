const axios = require("axios");

module.exports = checkAccessCode;

/**
 * 通过Code和密码获取shareId
 * @param {String} shareCode 分享Code
 * @param {String} accessCode 密码
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function checkAccessCode(shareCode, accessCode, cookie) {
    var url = "https://cloud.189.cn/api/open/share/checkAccessCode.action";
    var params = {
        shareCode: shareCode,
        accessCode: accessCode
    }
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
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