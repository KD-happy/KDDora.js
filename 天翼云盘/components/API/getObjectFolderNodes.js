const axios = require("axios");

module.exports = getObjectFolderNodes;

/**
 * 获取文件夹路径
 * @param {String} id 文件夹id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function getObjectFolderNodes(id, cookie) {
    var url = "https://cloud.189.cn/api/portal/getObjectFolderNodes.action";
    var data = {
        id: id,
        orderBy: 1,
        order: 'ASC'
    }
    try {
        var res = await axios.post(url, data, {
            headers: {
                'cookie': cookie,
                'referer': 'https://cloud.189.cn/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            }
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    return res.data;
}