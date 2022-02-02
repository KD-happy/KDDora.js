const axios = require("axios");
const qs = require("qs");

module.exports = checkBatchTask;

/**
 * 通过taskId来达到最后的操作
 * @param {String} type 操作类型
 * @param {String} taskId 操作id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function checkBatchTask(type, taskId, cookie) {
    var url = "https://cloud.189.cn/api/open/batch/checkBatchTask.action";
    var headers = {
        'accept': 'application/json;charset=UTF-8',
        'sign-type': '1',
        'cookie': cookie,
        'referer': 'https://cloud.189.cn/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var data = {
        'type': type, // DELETE
        'taskId': taskId
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