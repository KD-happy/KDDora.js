const axios = require("axios");

module.exports = policy;

/**
 * 切换存储策略
 * @param {String} id 存储策略id
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function policy(id, cookie) {
    var url = "https://moecloud.cn/api/v3/user/setting/policy";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var data = {id: id}
    var res = await axios({
        method: 'PATCH',
        url: url,
        data: data,
        headers: headers
    })
    return res.status == 200;
}