const axios = require("axios");

module.exports = searchFiles;

/**
 * 搜索
 * @param {String} folderId 搜索目录 文件夹id
 * @param {String} filename 搜索文件名
 * @param {Number} pageNum 页数
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function searchFiles(folderId, filename, pageNum, cookie) {
    var url = "https://cloud.189.cn/api/open/file/searchFiles.action";
    var params = {
        'folderId': folderId,
        'pageSize': '60',
        'pageNum': pageNum,
        'filename': filename,
        'recursive': 1,
        'iconOption': 5,
        'orderBy': 'lastOpTime', // 排序
        'descending': 'true'
    }
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    try {
        var res = await axios.get(url, {
            params: params,
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