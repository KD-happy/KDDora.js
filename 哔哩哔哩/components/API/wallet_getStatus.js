const axios = require("axios");

module.exports = wallet_getStatus;

/**
 * 获取钱包中的信息
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function wallet_getStatus(cookie) {
    var url = "https://api.live.bilibili.com/xlive/revenue/v1/wallet/getStatus"
    var headers = {
        'cookie': cookie,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    }
    return await axios.get(url, {
        headers: headers
    }).then(res => {
        return res.data.data
    }).catch(err => {
        console.log("请求错误！")
        return false
    })
}