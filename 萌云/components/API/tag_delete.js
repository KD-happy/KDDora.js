const axios = require("axios");

module.exports = tag_delete;

/**
 * 删除标签
 * @param {String} id 标签ID
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function tag_delete(id, cookie) {
    var url = `https://moecloud.cn/api/v3/tag/${id}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios({
        method: 'DELETE',
        url: url,
        headers: headers
    })
    return res.data.code == 0;
}