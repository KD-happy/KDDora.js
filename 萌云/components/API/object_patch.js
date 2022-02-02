const axios = require("axios");

module.exports = object_patch;

/**
 * 移动文件
 * @param {String} action 操作
 * @param {String} dst 目的路径
 * @param {String} id 文件id
 * @param {String} src_dir 源路径
 * @param {Boolean} is_file 是否为文件
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function object_patch(action, dst, id, src_dir, is_file, cookie) {
    var url = "https://moecloud.cn/api/v3/object";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    if (is_file) {
        var data = {
            action: action,
            dst: dst,
            src: {
                dirs: [],
                items: [id]
            },
            src_dir: src_dir
        }
    } else {
        var data = {
            action: action,
            dst: dst,
            src: {
                dirs: [id],
                items: []
            },
            src_dir: src_dir
        }
    }
    try {
        var res = await axios({
            method: "PATCH",
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