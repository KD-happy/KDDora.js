const axios = require("axios");

module.exports = directory_PUT;

/**
 * 创建文件夹
 * @param {String} path 路径
 * @param {String} cookie 请求Cookie
 * @returns {Boolean} 
 */
async function directory_PUT(path, cookie) {
    var url = "https://moecloud.cn/api/v3/directory";
    var data = {
        path: path
    }
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    try {
        var res = await axios({
            method: 'PUT',
            url: url,
            headers: headers,
            data: data
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    if (res.data.code == 0) {
        return true;
    } else {
        return false;
    }
}