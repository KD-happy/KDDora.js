const axios = require("axios");

module.exports = tags;

/**
 * 通过标签获取相关文件
 * @param {String} tag 
 * @param {String} cookie 
 * @returns {Object|Boolean}
 */
async function tags(tag, cookie) {
    var url = `https://moecloud.cn/api/v3/file/search/${tag}/internal`;
    var types = ['image', 'video', 'audio', 'doc'];
    var go = false;
    types.forEach(type => {
        if (tag == type) {
            go = true;
        }
    })
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    if (go) {
        var res = await axios.get(url, {
            headers: headers
        }).catch(() => {
            console.log("请求失败！");
            return false;
        })
        if (res.data.code == 0) {
            return res.data.data.objects;
        } else {
            return false;
        }
    } else {
        return false;
    }
}