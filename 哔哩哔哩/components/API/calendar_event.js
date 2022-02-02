const axios = require("axios");

module.exports = calendar_event;

/**
 * 日历 - 加入时间
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function calendar_event(cookie) {
    var url = "https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0";
    var headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
        'cookie': cookie
    }
    try {
        var res = await axios.get(url, {
            headers: headers
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    if (res.data.data.pfs == null) {
        return false;
    } else {
        return res.data.data.pfs;
    }
}