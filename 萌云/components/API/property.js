const axios = require("axios");

module.exports = property;

/**
 * 文件夹属性
 * @param {String} id 文件ID
 * @param {Boolean} is_folder 判断是否为文件夹
 * @param {String} cookie 请求Cookie
 * @returns {Object|Boolean}
 */
async function property(id, is_folder, cookie) {
    var url = `https://moecloud.cn/api/v3/object/property/${id}?trace_root=false&is_folder=${is_folder}`;
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
        return res.data.data;
    } else {
        return false;
    }
}