const axios = require("axios");

module.exports = relation_followings;

/**
 * 获取关注大标签中的信息
 * @param {String} cookie 请求Cookie
 * @returns {Object}
 */
async function relation_followings(mid, page, attention, cookie) {
    var url = "https://api.bilibili.com/x/relation/followings";
    var params = {
        vmid: mid,
        pn: page,
        ps: '20',
        order: 'desc',
        order_type: attention, // 排序 ''最新关注, 'attention'最常访问
        jsonp: 'jsonp'
    }
    var res = await axios.get(url, {
        params: params,
        headers: {
            'cookie': cookie,
            'referer': 'https://space.bilibili.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
    return res.data.data.list;
}