const axios = require("axios");

module.exports = storage;

/**
 * 通过Cookie获取相关容量信息
 * @param {String} cookie 
 * @returns {Object} 
 */
async function storage(cookie) {
    var url = "https://moecloud.cn/api/v3/user/storage";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios.get(url, {
        headers: headers
    }).catch(() => {
        console.log("请求失败！");
        return false;
    })
    if (res.data.code == 0) {
        return res.data;
    } else {
        return false;
    }
}