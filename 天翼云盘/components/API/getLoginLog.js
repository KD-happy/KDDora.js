const axios = require("axios");

module.exports = getLoginLog;

/**
 * 获取登录日志
 * @param {Number} pageNum 页面
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function getLoginLog(pageNum, cookie) {
    var url = "https://e.189.cn/user/account/getLoginLog.do";
    var headers = {
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var params = {
        pageSize: 50,
        pageNum: pageNum
    }
    try {
        var res = await axios.get(url, {
            params: params,
            headers: headers
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    if (res.data.ret == 1) {
        return res.data;
    } else {
        return false;
    }
}