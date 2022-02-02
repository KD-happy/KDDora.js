const axios = require("axios");

module.exports = tag_filter;

/**
 * 创建正则标签
 * @param {String} name 标签名
 * @param {String} expression 文件的正则表达式
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function tag_filter(name, expression, cookie) {
    var url = "https://moecloud.cn/api/v3/tag/filter";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var data = {
        expression: expression,
        name: name,
        color: "#e91e63",
        icon: "Heart"
    }
    try {
        var res = await axios.post(url, data=data, {
            headers: headers
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    return res.data.code == 0;
}