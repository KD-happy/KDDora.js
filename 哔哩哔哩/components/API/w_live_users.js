const axios = require("axios");

module.exports = w_live_users;

/**
 * 获取直播间信息
 * @param {Number} size 获取多少直播间
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function w_live_users(size, cookie) {
    var url =  `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users?size=${size}`;
    var res = await axios.get(url, {
        headers: {
            'cookie': cookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
    return res.data.data;
}