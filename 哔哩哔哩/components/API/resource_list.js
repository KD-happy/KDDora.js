const axios = require("axios");

module.exports = resource_list;

/**
 * 获取单个收藏夹详细内容
 * @param {Number} page 页数
 * @param {Number}} id 收藏夹id
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function resource_list(page, id, cookie) {
    var url = 'https://api.bilibili.com/x/v3/fav/resource/list';
    var params = {
        media_id: id,
        pn: page,
        ps: 20,
        keyword: '',
        order: 'mtime',
        type: 0,
        tid: 0,
        platform: 'web',
        jsonp: 'jsonp'
    }
    try {
        var res = await axios.get(url, {
            params: params,
            headers: {
                'cookie': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    return res.data.data;
}