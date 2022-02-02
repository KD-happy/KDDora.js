const axios = require("axios");

module.exports = policies;

/**
 * 获取储存策略
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function policies(cookie) {
    var url = "https://moecloud.cn/api/v3/user/setting/policies";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios.get(url, {
        headers: headers
    })
    if (res.data.code == 0) {
        return res.data.data;
    } else {
        return false;
    }
}