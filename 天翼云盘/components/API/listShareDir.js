const axios = require("axios");

module.exports = listShareDir;

/**
 * 获取分享文件列表
 * @param {Number} pageNum 页面
 * @param {String} fileId 文件ID
 * @param {String} shareDirFileId 分享路径文件ID
 * @param {Boolean} isFolder 是否为文件夹
 * @param {String} shareId 分享ID
 * @param {Number} shareMode 分享模式 1 有密码  2 无密码
 * @param {String} orderBy 排序
 * @param {Boolean} descending 降序
 * @param {String} accessCode 密码
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function listShareDir(pageNum, fileId, shareDirFileId, isFolder, shareId, shareMode, orderBy, descending, accessCode, cookie) {
    var url = "https://cloud.189.cn/api/open/share/listShareDir.action";
    var params = {
        pageNum: pageNum,
        pageSize: 60,
        fileId: fileId,
        shareDirFileId: shareDirFileId,
        isFolder: isFolder,
        shareId: shareId, // 无密码的getShareInfoByCodeV2直接获得   有秘密的checkAccessCode中获得
        shareMode: shareMode,
        iconOption: 5,
        orderBy: orderBy,
        descending: descending,
        accessCode: accessCode
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