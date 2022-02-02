const axios = require("axios");
const qs = require("qs");

module.exports = createFolder;

/**
 * 创建文件夹
 * @param {String} parentFolderId 父亲文件夹id
 * @param {String} folderName 文件夹名
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function createFolder(parentFolderId, folderName, cookie) {
    var url = "https://cloud.189.cn/api/open/file/createFolder.action";
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var data = {
        parentFolderId: parentFolderId,
        folderName: folderName
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