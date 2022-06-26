const axios = require("axios");

/**
 * 关注列表搜索
 * @param {String} vmid 用户mid
 * @param {Number} pn 搜索页数
 * @param {String} name 搜索名称
 * @param {String} cookie Cookie
 * @returns {Promise}
 */
module.exports = async function followings_search(vmid, pn, name, cookie) {
    var url = 'https://api.bilibili.com/x/relation/followings/search'
    var params = {
        vmid: vmid,
        pn: pn,
        ps: 20,
        order: 'desc',
        order_type: 'attention',
        name: name,
    }
    return axios.get(url, {
        params: params,
        headers: {
            'cookie': cookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
}