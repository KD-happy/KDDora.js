const axios = require("axios");

module.exports = share_save;

/**
 * 保存文件
 * @param {String} key 文件key
 * @param {String} path 保存路径
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function share_save(key, path, cookie) {
    var url = `https://moecloud.cn/api/v3/share/save/${key}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var data = {
        path: path
    }
    var res = await axios.post(url, data=data, {
        headers: headers
    })
    return res.data.code == 0;
}