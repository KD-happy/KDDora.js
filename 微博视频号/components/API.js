const axios = require("axios");
const qs = require("qs");

module.exports = (cookie) => {
    var headers = {
        'cookie': cookie,
        'content-type': 'application/x-www-form-urlencoded',
        'referer': 'https://weibo.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    }
    return {
        /**
         * 获取用户视频列表
         * @param {String} uid 用户ID
         * @param {String} cursor 下一个请求
         * @returns {Promise}
         */
        getWaterFallContent: async (uid, cursor=0) => {
            let url = "https://weibo.com/ajax/profile/getWaterFallContent"
            return axios.get(url, {
                headers: headers,
                params: {
                    uid: uid,
                    cursor: cursor
                }
            })
        },
        /**
         * 通过视频ID获取Video
         * @param {String} object_id 视频ID
         * @returns {Promise}
         */
        getVideoByURL: async (object_id) => {
            let url = "https://weibo.com/tv/api/component"
            return axios.post(url, data=`data={\"Component_Play_Playinfo\":{\"oid\":\"${object_id}\"}}`, {
                headers: headers,
                params: {
                    page: `/tv/show/${object_id}`
                }
            })
        },
        /**
         * 获取用户视频标签
         * @param {String} uid 用户ID
         * @returns {Promise}
         */
        getVideoTab: async (uid) => {
            let url = "https://weibo.com/ajax/profile/getVideoTab"
            return axios.get(url, {
                headers: headers,
                params: {
                    uid: uid
                }
            })
        },
        /**
         * 获取列表视频的详细信息
         * @param {String} cid Table列表中的id
         * @param {String} tab_code 排序 1: 最热、0: 默认
         * @param {String} cursor 下一页
         * @returns {Promise}
         */
        getCollectionList: async (cid, tab_code=0, cursor=0) => {
            let url = "https://weibo.com/ajax/profile/getCollectionList"
            var param = {}
            // 最热不能有cursor参数，还有一个 has_header = true/false -- 里面时最热默认的参数
            if (cursor == 0) {
                param = {
                    cid: cid,
                    tab_code: tab_code,
                }
            } else {
                param = {
                    cid: cid,
                    tab_code: tab_code,
                    cursor: cursor
                }
            }
            return axios.get(url, {
                headers: headers,
                params: param
            })
        },
        /**
         * 获取点赞过的视频
         * @param {String} uid 用户UID
         * @param {String} cursor 下一页
         * @returns {Promise}
         */
        getLikeList: async (uid, cursor=0) => {
            let url = 'https://weibo.com/ajax/profile/getLikeList'
            return axios.get(url, {
                headers: headers,
                params: {
                    uid: uid,
                    cursor: cursor
                }
            })
        },
        /**
         * 通过UID获取用户信息
         * @param {String} uid 用户UID
         * @returns {Promise}
         */
        getInfoByUID: async (uid) => {
            let url = 'https://weibo.com/ajax/profile/info'
            return axios.get(url, {
                headers: headers,
                params: {
                    'uid': uid
                }
            })
        },
        /**
         * 通过UID获取用户IP归属地
         * @param {String} uid 用户UID
         * @returns {Promise}
         */
        getIPByUID: async (uid) => {
            let url = 'https://weibo.com/ajax/profile/detail'
            return axios.get(url, {
                headers: headers,
                params: {
                    'uid': uid
                }
            })
        }
    }
}