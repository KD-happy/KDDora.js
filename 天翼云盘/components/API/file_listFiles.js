const axios = require("axios");

module.exports = file_listFiles;

/**
 * 获取文件id中文件和文件夹相关信息
 * @param {Number} pageNum 请求页数
 * @param {String} folderId 文件Id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function file_listFiles(pageNum, folderId, cookie) {
    var url = "https://cloud.189.cn/api/open/file/listFiles.action";
    var headers = {
        'accept': 'application/json;charset=UTF-8', // 非常重要
        'sign-type': '1', // 非常重要
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var params = {
        pageSize: 60,
        pageNum: pageNum,
        folderId: folderId,
        orderBy: "lastOpTime",
        descending: true
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