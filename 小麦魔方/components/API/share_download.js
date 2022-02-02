const axios = require("axios");

module.exports = share_download;

/**
 * 下载分享链接的资源
 * @param {String} key 分享文件key
 * @param {String} cookie 请求Cookie
 * @returns {String}
 */
async function share_download(key, cookie) {
    var url = `https://mo.own-cloud.cn/api/v3/share/download/${key}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://mo.own-cloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    try {
        var res = await axios({
            method: 'PUT',
            url: url,
            headers: headers
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    if (res.data.code == 0) {
        return res.data.data;
    } else {
        return false;
    }
}