const axios = require("axios");
const qs = require("qs");

module.exports = renameFolder;

/**
 * 文件夹重命名
 * @param {String} folderId 文件夹id
 * @param {String} newName 新命名
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function renameFolder(folderId, newName, cookie) {
    var url = "https://cloud.189.cn/api/open/file/renameFolder.action";
    var data = {
        'folderId': folderId,
        'destFolderName': newName
    }
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    try {
        var res = await axios.post(url, qs.stringify(data), {
            headers: headers
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    if (res.data.res_code != null) {
        return res.data;
    } else {
        return false;
    }
}