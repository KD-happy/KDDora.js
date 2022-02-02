const axios = require("axios");
const qs = require("qs");

module.exports = createBatchTask;

/**
 * 批量操作获取 taskId
 * @param {String} type 操作类型
 * @param {String} taskInfos 文件集合
 * @param {String} targetFolderId 父文件夹id
 * @param {String} shareId 分享Id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function createBatchTask(type, taskInfos, targetFolderId, shareId, cookie) {
    var url = "https://cloud.189.cn/api/open/batch/createBatchTask.action";
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    if (shareId == "") {
        var data = {
            'type': type, // DELETE
            'taskInfos': taskInfos, // [{"fileId":"41381115415317398","fileName":"新建文件夹","isFolder":1}]
            'targetFolderId': targetFolderId
        }
    } else {
        var data = {
            'type': type, // DELETE
            'taskInfos': taskInfos, // [{"fileId":"41381115415317398","fileName":"新建文件夹","isFolder":1}]
            'targetFolderId': targetFolderId,
            'shareId': shareId
        }
    }
    try {
        var res = await axios.post(url, data=qs.stringify(data), {
            headers: headers
        })
    } catch (error) {
        console.log("请求错误！");
        return false;
    }
    if (res.data.res_code != null) {
        return res.data;
    } else {
        return false;
    }
}