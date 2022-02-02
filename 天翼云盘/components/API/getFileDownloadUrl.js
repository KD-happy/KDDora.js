const axios = require("axios");

module.exports = getFileDownloadUrl;

/**
 * 获取文件下载地址 -- 可用来播放视频
 * @param {String} fileId 文件id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function getFileDownloadUrl(fileId, cookie) {
    var url = `https://cloud.189.cn/api/open/file/getFileDownloadUrl.action?fileId=${fileId}`;
    var headers = {
        'accept': 'application/json;charset=UTF-8', // 非常重要
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