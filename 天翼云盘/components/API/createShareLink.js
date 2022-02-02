const axios = require("axios");

module.exports = createShareLink;

/**
 * 创建分享文件
 * @param {String} fileId 文件id
 * @param {Number} expireTime 过期时间 1 1天有效期 7 7天有限期 2099 永久有效
 * @param {Number} shareType 分享类型 2 公开分享  3 密码分享
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function createShareLink(fileId, expireTime, shareType, cookie) {
    var url = "https://cloud.189.cn/api/open/share/createShareLink.action";
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var params = {
        fileId: fileId, // 文件id
        expireTime: expireTime, // 有效时间
        shareType: shareType
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