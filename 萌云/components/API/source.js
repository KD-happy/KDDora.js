const axios = require("axios");

module.exports = source;

/**
 * 获取外链 不能使用
 * @param {String} id 
 * @param {String} cookie 
 * @returns {Object}
 */
async function source(id, cookie) {
    var url = `https://moecloud.cn/api/v3/file/source/${id}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios.get(url, {
        headers: headers
    })
    return res.data;
}