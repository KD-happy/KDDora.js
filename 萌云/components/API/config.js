const axios = require("axios");

module.exports = config;

/**
 * 获取用户配置文件
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function config(cookie) {
    var url = "https://moecloud.cn/api/v3/site/config";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios.get(url, {
        headers: headers
    })
    return res.data.data.user;
}