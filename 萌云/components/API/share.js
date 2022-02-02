const axios = require("axios");

module.exports = share;

/**
 * 创建分享
 * @param {String} id 文件ID
 * @param {Boolean} is_dir 是否文件夹
 * @param {String} password 密码
 * @param {Boolean} preview 是否支持预览
 * @param {Number} score 下载支付积分
 * @param {String} cookie 请求Cookie
 * @returns {String} 分享连接
 */
async function share(id, is_dir, password, preview, score, cookie) {
    var url = "https://moecloud.cn/api/v3/share";
    var headers = {
        'cookie': cookie,
        'referer': 'https://moecloud.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var data = {
        'downloads': -1,
        'expire': 86400,
        'id': id,
        'is_dir': is_dir,
        'password': password,
        'preview': preview,
        'score': score
    }
    try {
        var res = await axios.post(url, data, {
            headers: headers
        })
    } catch {
        console.log("请求失败！");
        return false;
    }
    if (res.data.code == 0) {
        return res.data.data;
    } else {
        return false;
    }
}