const axios = require("axios");

module.exports = preview;

/**
 * 预览文件
 * @param {String} id 
 * @param {String} 
 */
async function preview(id, cookie) {
    var url = `https://mo.own-cloud.cn/api/v3/file/preview/${id}`;
    console.log(url);
    var headers = {
        'cookie': cookie,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios.get(url, {
        headers: headers,
        responseType: 'stream'
    })
    return res.data.responseUrl;
}