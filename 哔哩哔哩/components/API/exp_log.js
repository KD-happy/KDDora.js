const axios = require("axios");

/**
 * 登录记录
 * @param {String} cookie Cookie
 * @returns {Promise}
 */
module.exports = async function exp_log(cookie) {
    return axios.get('https://api.bilibili.com/x/member/web/exp/log', {
        headers: {
            'cookie': cookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
}