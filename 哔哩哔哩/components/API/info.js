const axios = require("axios");

module.exports = info;

/**
 * 获取用户信息
 * @param {Number} mid 用户mid
 * @returns {Object}
 */
async function info(mid) {
    var url = `https://api.bilibili.com/x/space/acc/info?mid=${mid}&jsonp=jsonp`;
    var res = await axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
    return res.data.data;
}