const axios = require("axios");

module.exports = search_tag;

/**
 * 自定义标签
 * @param {String} id 标签id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function search_tag(id, cookie) {
    var url = `https://moecloud.cn/api/v3/file/search/tag%2F${id}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios.get(url, {
        headers: headers
    })
    if (res.data.code != 0) {
        return false;
    } else {
        return res.data.data.objects;
    }
}