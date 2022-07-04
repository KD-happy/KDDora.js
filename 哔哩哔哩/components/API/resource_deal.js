const axios = require("axios");
const qs = require("qs");

/**
 * 收藏夹 添加/删除
 * @param {String} cookie Cookie
 * @param {String} csrf 用户验证
 * @param {Number} aid 视频 aid
 * @param {Number} media_ids 添加收藏夹id
 * @param {Boolean} add 是否添加
 * @returns {Promise}
 */
module.exports = async function resource_deal(cookie, csrf, aid, media_ids, add) {
    let data;
    if (add) {
        data = {
            rid: aid,
            type: 2,
            add_media_ids: media_ids,
            del_media_ids: '',
            jsonp: 'jsonp',
            csrf: csrf,
            platform: 'web'
        }
    } else {
        data = {
            rid: aid,
            type: 2,
            add_media_ids: '',
            del_media_ids: media_ids,
            jsonp: 'jsonp',
            csrf: csrf,
            platform: 'web'
        }
    }
    return axios.post('https://api.bilibili.com/x/v3/fav/resource/deal', qs.stringify(data), {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'cookie': cookie
        }
    })
}