const axios = require("axios");

module.exports = share_password;

/**
 * 修改分享链接密码
 * @param {String} key 分享key
 * @param {String} value 更改的密码
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function share_password(key, value, cookie) {
    var url = `https://moecloud.cn/api/v3/share/${key}`;
    var data = {
        prop: "password",
        value: value
    }
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios({
        method: "PATCH",
        url: url,
        data: data,
        headers: headers
    }).catch(() => {
        console.log("请求失败！");
        return false;
    })
    return res.data.code == 0;
}