const axios = require("axios");

module.exports = copy;

/**
 * 复制文件
 * @param {String} dst 目标路径
 * @param {String} id 文件id
 * @param {String} src_dir 源路径
 * @param {Boolean} is_file 是否为文件
 * @param {String} cookie 请求Cookie
 * @returns {Boolean}
 */
async function copy(dst, id, src_dir, is_file, cookie) {
    var url = "https://mo.own-cloud.cn/api/v3/object/copy";
    var headers = {
        'cookie': cookie,
        'referer': 'https://mo.own-cloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    if (is_file) {
        var data = {
            dst: dst,
            src: {
                items: [id],
                dirs: []
            },
            src_dir: src_dir
        }
    } else {
        var data = {
            dst: dst,
            src: {
                items: [],
                dirs: [id]
            },
            src_dir: src_dir
        }
    }
    console.log(data);
    try {
        var res = await axios.post(url, data, {
            headers: headers
        })
        console.log(res.data);
    } catch {
        console.log("请求失败！");
        return false;
    }
    return res.data.code == 0;
}