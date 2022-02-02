const axios = require("axios");

module.exports = folder_created_list_all;

/**
 * 获取全部收藏夹信息 标签
 * @param {Number} mid 用户mid
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function folder_created_list_all(mid, cookie) {
    var url = "https://api.bilibili.com/x/v3/fav/folder/created/list-all";
    var params = {
        up_mid: mid,
        jsonp: 'jsonp'
    }
    try {
        var res = await axios.get(url, {
            params: params,
            headers: {
                'cookie': cookie
            }
        })
    } catch {
        console.log("请求错误！");
        return false;
    }
    if (res.data.data == null) {
        return false;
    } else {
        return res.data.data.list;
    }
}