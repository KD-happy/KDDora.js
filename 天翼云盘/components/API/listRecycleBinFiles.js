const axios = require("axios");

module.exports = listRecycleBinFiles;

/**
 * 获取回收站文件列表
 * @param {Number} pageNum 页数
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function listRecycleBinFiles(pageNum, cookie) {
    var url = "https://cloud.189.cn/api/open/file/listRecycleBinFiles.action";
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var params = {
        pageNum: pageNum,
        pageSize: 30,
        iconOption: 1,
        family: false
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