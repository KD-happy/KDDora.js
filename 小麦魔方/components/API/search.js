const axios = require("axios");

module.exports = search;

/**
 * 搜索文件
 * @param {String} keyword 
 * @param {String} cookie 
 * @returns {Object|Boolean}
 */
async function search(keyword, cookie) {
    var url = `https://mo.own-cloud.cn/api/v3/file/search/keywords/${encodeURIComponent(keyword)}`;
    var headers = {
        'cookie': cookie,
        'referer': 'https://mo.own-cloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
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