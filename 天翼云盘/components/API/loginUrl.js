const axios = require("axios");

module.exports = loginUrl;

/**
 * 获取新IP的COOKIE_LOGIN_USER
 * @param {String} SSON 请求Cookie
 * @returns {String}
 */
async function loginUrl(SSON) {
    var url = "https://cloud.189.cn/api/portal/loginUrl.action";
    try {
        await axios.get(url, {
            headers: {
                'cookie': "",
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            },
            maxRedirects: 0 // 重定向次数
        })
    } catch (error) { // 重定向 302 报错
        url = error.response.headers.location;
    }
    try {
        await axios.get(url, {
            maxRedirects: 0,
            headers: {
                'cookie': SSON,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            }
        })
    } catch (error) {
        url = error.response.headers.location;
    }
    try {
        await axios.get(url, {
            maxRedirects: 0,
            headers: {
                'cookie': "",
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            }
        })
    } catch (error) {
        return /COOKIE_LOGIN_USER=(.*); D/g.exec(JSON.stringify(error.response.headers))[1];
    }
}