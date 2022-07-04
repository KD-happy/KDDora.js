const axios = require("axios");
const qs = require("qs");

/**
 * 视频点赞
 * @param {String} cookie Cookie
 * @param {String} csrf 用户验证
 * @param {Number} aid 视频 aid
 * @param {String} bvid 视频 bvid
 * @param {Number} multiply 投币数 1, 2
 * @param {Number} select_like 是否附加点赞	0: 不点赞， 1: 同时点赞
 * @returns {Promise}
 */
module.exports = async function coin_add(cookie, csrf, aid, bvid, multiply, select_like=0) {
    let data;
    if (aid != null) {
        data = {
            aid: aid,
            csrf: csrf,
            multiply: multiply,
            select_like: select_like
        }
    } else {
        data = {
            bvid: bvid,
            csrf: csrf,
            multiply: multiply,
            select_like: select_like
        }
    }
    return axios.post('http://api.bilibili.com/x/web-interface/coin/add', qs.stringify(data), {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'cookie': cookie
        }
    })
}