const axios = require("axios");

module.exports = share_list;

/**
 * 获取分享链接的路径
 * @param {String} key 分享key
 * @param {String} path 文件路径
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function share_list(key, path, cookie) {
    var url = `https://moecloud.cn/api/v3/share/list/${key}${encodeURIComponent(path)}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    console.log(url);
    try {
        var res = await axios.get(url, {
            headers: headers
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    if (res.data.code == 0) {
        return res.data.data.objects;
    } else {
        return false;
    }
}