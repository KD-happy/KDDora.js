const axios = require("axios");

module.exports = object_delete;

/**
 * 删除文件
 * @param {String} id 文件id
 * @param {Boolean} is_file 是否为文件
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function object_delete(id, is_file, cookie) {
    var url = "https://moecloud.cn/api/v3/object";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    if (is_file) {
        var data = {
            items: [id],
            dirs: []
        }
    } else {
        var data = {
            items: [],
            dirs: [id]
        }
    }
    try {
        var res = await axios({
            method: "DELETE",
            data: data,
            url: url,
            headers: headers
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    return res.data.code == 0;
}