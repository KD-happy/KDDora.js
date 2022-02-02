const axios = require("axios");

module.exports = portal_listFiles;

/**
 * 获取文件路径和文件夹中的文件信息
 * @param {String} fileId 文件Id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function portal_listFiles(fileId, cookie) {
    var url = "https://cloud.189.cn/api/portal/listFiles.action";
    var headers = {
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var params = {
        fileId: fileId
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