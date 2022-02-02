const axios = require("axios");

module.exports = session;

/**
 * 登录小麦魔方
 * @param {String} userName 
 * @param {String} Password 
 * @returns {String|Boolean} 
 */
async function session(userName, Password) {
    var url = "https://mo.own-cloud.cn/api/v3/user/session";
    var headers = {
        'referer': 'https://mo.own-cloud.cn/',
        'content-type': 'application/json;charset=UTF-8',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var data = {
        Password: Password,
        userName: userName,
        captchaCode: ""
    }
    var res = await axios.post(url, data, {
        headers: headers
    }).catch(() => {
        console.log("请求失败！");
        return false;
    })
    if (res.data.code == 0) {
        var cookies = "";
        res.headers["set-cookie"].forEach(element => {
            cookies += (element.split("path=")[0].split("Path=")[0]);
        });
        return cookies;
    } else {
        return false;
    }
}