const axios = require("axios");

module.exports = download;

/**
 * 获取文件下载连接
 * @param {String} id 文件id
 * @param {String} cookie 请求Cookie
 * @param {String|Boolean} 
 */
async function download(id, cookie) {
    var url = `https://moecloud.cn/api/v3/file/download/${id}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
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