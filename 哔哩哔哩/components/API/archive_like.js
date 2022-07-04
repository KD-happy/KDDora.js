const axios = require("axios");
const qs = require("qs");

/**
 * 视频点赞
 * @param {String} cookie Cookie
 * @param {String} csrf 用户验证
 * @param {Number} aid 视频 aid
 * @param {String} bvid 视频 bvid
 * @param {Number} like 1: 点赞，2: 取消点赞
 * @returns {Promise}
 */
module.exports = async function archive_like(cookie, csrf, aid, bvid, like) {
    let data
    if (aid != null) {
        data = {
            aid: aid,
            like: like,
            csrf: csrf,
        }
    } else {
        data = {
            bvid: bvid,
            like: like,
            csrf: csrf,
        }
    }
    return axios.post('https://api.bilibili.com/x/web-interface/archive/like', qs.stringify(data), {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'cookie': cookie
        }
    })
}