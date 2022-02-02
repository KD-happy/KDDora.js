const axios = require("axios");

module.exports = rename;

/**
 * 重新命名文件
 * @param {String} id 文件id
 * @param {Boolean} is_file 是否为文件
 * @param {String} new_name 新文件名
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function rename(id, is_file, new_name, cookie) {
    var url = "https://mo.own-cloud.cn/api/v3/object/rename";
    if (is_file) {
        var data = {
            action: "rename",
            src: {
                "dirs": [],
                "items": [id]
            },
            new_name: new_name
        }
    } else {
        var data = {
            action: "rename",
            src: {
                "dirs": [id],
                "items": []
            },
            new_name: new_name
        }
    }
    var headers = {
        'cookie': cookie,
        'referer': 'https://mo.own-cloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    try {
        var res = await axios.post(url, data, {
            headers: headers
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    return res.data.code == 0;
}