const axios = require("axios");
const qs = require("qs");

module.exports = () => {
    return {
        /**
         * av号转bv号
         * @param {Number} av 视频 aid
         * @returns {String}
         */
        AV2BV: async (av) => {
            a2bEncTable = ["f","Z","o","d","R","9","X","Q","D","S","U","m","2","1","y","C","k","r","6","z","B","q","i","v","e","Y","a","h","8","b","t","4","x","s","W","p","H","n","J","E","7","j","L","5","V","G","3","g","u","M","T","K","N","P","A","w","c","F"];
            a2bEncIndex = [11, 10, 3, 8, 4, 6];
            a2bXorEnc = 0b1010100100111011001100100100;
            a2bAddEnc = 8728348608;
            if (Math.floor(av) == av) {
                tmp = "BV1@@4@1@7@@";
                for (i = 0; i < a2bEncIndex.length; i++) {
                tmp =
                    tmp.substring(0, a2bEncIndex[i]) +
                        a2bEncTable[Math.floor(
                            ((av ^ a2bXorEnc) + a2bAddEnc) / Math.pow(a2bEncTable.length, i)
                        ) % a2bEncTable.length] + tmp.substring(a2bEncIndex[i] + 1);
                }
                return tmp;
            } else {
                return "请输入正确的AV号！（纯数字不带AV）";
            }
        },
        /**
         * bv号转av号
         * @param {String} bv bvid
         * @returns {Number}
         */
        BV2AV: async (bv) => {
            a2bEncTable = ["f","Z","o","d","R","9","X","Q","D","S","U","m","2","1","y","C","k","r","6","z","B","q","i","v","e","Y","a","h","8","b","t","4","x","s","W","p","H","n","J","E","7","j","L","5","V","G","3","g","u","M","T","K","N","P","A","w","c","F"];
            a2bEncIndex = [11, 10, 3, 8, 4, 6];
            a2bXorEnc = 0b1010100100111011001100100100;
            a2bAddEnc = 8728348608;
            tmp = 0;
            for (i = 0; i < a2bEncIndex.length; i++) {
                if (a2bEncTable.indexOf(bv[a2bEncIndex[i]]) == -1) {
                    return "请输入正确的BV号！";
                } else {
                    tmp += a2bEncTable.indexOf(bv[a2bEncIndex[i]]) * Math.pow(a2bEncTable.length, i);
                }
            }
            tmp = (tmp - a2bAddEnc) ^ a2bXorEnc;
            return tmp;
        },
        /**
         * 获取当前视频 点赞、收藏、投币次数的情况
         * @param {String} cookie Cookie
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @returns {Promise}
         */
        archive_relation: async (cookie, aid, bvid) => {
            let params = aid != null ? {aid: aid} : {bvid: bvid}
            return axios.get('https://api.bilibili.com/x/web-interface/archive/relation', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取视频 aid bvid share coin like favorite
         * @param {String} cookie Cookie
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @returns {Promise}
         */
        archive_stat: async (cookie, aid, bvid) => {
            let params = aid != null ? {aid: aid} : {bvid: bvid}
            return axios.get('https://api.bilibili.com/x/web-interface/archive/stat', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取视频TAG
         * @param {String} cookie Cookie
         * @param {Number} aid 视频aid
         * @param {String} bvid 视频bvid
         * @returns {Promise}
         */
        archive_tags: async (cookie, aid, bvid) => {
            let params = aid != null ? {aid: aid} : {bvid: bvid}
            return axios.get('https://api.bilibili.com/x/tag/archive/tags', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 搜索视频
         * @param {String} mid 用户Mid
         * @param {Number} pn 页数
         * @param {String} keyword 关键字
         * @param {String} order 排序
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        arc_search: async (mid, pn, keyword, order, cookie) => {
            return axios.get('https://api.bilibili.com/x/space/arc/search', {
                params: {
                    mid: mid,
                    ps: 30,
                    tid: 0,
                    pn: pn,
                    keyword: keyword,
                    order: order,
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 视频点赞
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @param {Number} like 1: 点赞，2: 取消点赞
         * @returns {Promise}
         */
        archive_like: async (cookie, csrf, aid, bvid, like) => {
            let data = aid != null ? {aid: aid, like: like, csrf: csrf} : {bvid: bvid, like: like, csrf: csrf}
            return axios.post('https://api.bilibili.com/x/web-interface/archive/like', qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 日历 - 加入时间
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        calendar_event: async (cookie) => {
            return axios.get('https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
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
        coin_add: async (cookie, csrf, aid, bvid, multiply, select_like=0) => {
            let data = aid != null ? {aid: aid, csrf: csrf, multiply: multiply, select_like: select_like} : {bvid: bvid, csrf: csrf, multiply: multiply, select_like: select_like}
            return axios.post('https://api.bilibili.com/x/web-interface/coin/add', qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 硬币记录
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        coin_log: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/member/web/coin/log', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取动态历史
         * @param {Number} mid 用户mid
         * @param {Number} dynamic_id 动态id
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        dynamic_history: async (mid, dynamic_id, cookie) => {
            return axios.get('https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history', {
                params: {
                    'uid': mid,
                    'offset_dynamic_id': dynamic_id,
                    'type': 8,
                    'from': '',
                    'platform': 'web'
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 动态信息 -- 第一次请求
         * @param {Number} mid 用户mid
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        dynamic_new: async (mid, cookie) => {
            return axios.get('https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new', {
                params: {
                    'uid': mid,
                    'type_list': 8,
                    'from': '',
                    'platform': 'web'
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 分区最新视频
         * @param {String} cookie
         * @param {Number} pn 页码
         * @param {Number} ps 每页项数
         * @param {Nubmer} rid 分区 id
         * @returns {Promise}
         */
        dynamic_region: async (cookie, pn, ps, rid) => {
            return axios.get("http://api.bilibili.com/x/web-interface/dynamic/region", {
                params: {
                    pn: pn,
                    ps: ps,
                    rid: rid
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 登录记录
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        exp_log: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/member/web/exp/log', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取经验任务
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        exp_reward: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/member/web/exp/reward', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取指定UP主动态
         * @param {String} cookie Cookie
         * @param {String} offset 动态id
         * @param {Number} mid UP主mid
         * @returns {Promise}
         */
        feed_space: async (cookie, offset, mid) => {
            return axios.get('https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space', {
                params: {
                    offset: offset,
                    host_mid: mid,
                    timezone_offset: -480,
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取全部收藏夹信息 标签
         * @param {Number} mid 用户mid
         * @param {String} cookie 请求Cookie
         * @param {Number} rid aid 查看视频在收藏夹中的位置
         * @returns {Promise}
         */
        folder_created_list_all: async (mid, cookie, rid=0) => {
            let params = rid != 0 ? {
                    up_mid: mid,
                    jsonp: 'jsonp',
                    rid: rid
                } : {
                    up_mid: mid,
                    jsonp: 'jsonp'
                }
            return axios.get('https://api.bilibili.com/x/v3/fav/folder/created/list-all', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 关注列表搜索
         * @param {String} vmid 用户mid
         * @param {Number} pn 搜索页数
         * @param {String} name 搜索名称
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        followings_search: async (vmid, pn, name, cookie) => {
            return axios.get('https://api.bilibili.com/x/relation/followings/search', {
                params: {
                    vmid: vmid,
                    pn: pn,
                    ps: 20,
                    order: 'desc',
                    order_type: 'attention',
                    name: name,
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取历史列表
         * @param {Object} params 请求参数
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        history_cursor: async (params, cookie) => {
            return axios.get('https://api.bilibili.com/x/web-interface/history/cursor', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 上传视频进度
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} aid 视频 aid
         * @param {Number} cid 视频 cid
         * @returns {Promise}
         */
        history_report: async (cookie, csrf, aid, cid) => {
            let data = {
                aid: aid,
                cid: cid,
                progres: 300,
                csrf: csrf
            }
            return axios.post("http://api.bilibili.com/x/v2/history/report", qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 历史搜索
         * @param {Number} pn 页数
         * @param {String} keyword 搜索关键字
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        history_search: async (pn, keyword, cookie) => {
            return axios.get('https://api.bilibili.com/x/web-goblin/history/search', {
                params: {
                    pn: pn,
                    keyword: keyword,
                    business: 'all'
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 稍后再看
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        history_toview: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/v2/history/toview/web', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 添加稍后再看
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @returns {Promise}
         */
        history_toview_add: async (cookie, csrf, aid, bvid) => {
            let data = aid != null ? {aid: aid, csrf: csrf} : {bvid: bvid, csrf: csrf}
            return axios.post('https://api.bilibili.com/x/v2/history/toview/add', qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 从稍后再看删除
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @returns {Promise}
         */
        history_toview_del: async (cookie, csrf, aid, bvid) => {
            let data = aid != null ? {aid: aid, csrf: csrf} : {bvid: bvid, csrf: csrf}
            return axios.post('https://api.bilibili.com/x/v2/history/toview/del', qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取用户信息
         * @param {Number} mid 用户mid
         * @returns {Promise}
         */
        info: async (mid) => {
            return axios.get('https://api.bilibili.com/x/space/acc/info', {
                params: {
                    mid: mid,
                    jsonp: 'jsonp'
                },
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 直播签到
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        live_sign: async (cookie) => {
            return axios.get('https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 登录记录
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        login_log: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/member/web/login/log', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 漫画签到
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        manga_ClockIn: async (cookie) => {
            let data = {
                platform: 'android'
            }
            return axios.post('https://manga.bilibili.com/twirp/activity.v1.Activity/ClockIn', data=qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取关注人数、粉丝数
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        nav_stat: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/web-interface/nav/stat', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 导航个人信息
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        nav: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/web-interface/nav', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取播放视频链接
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @param {Number} cid 视频 cid
         * @param {Number} qn 清晰度
         * @param {String} type 视频类型
         * @param {String} platform 来源
         * @returns {Promise}
         */
        player_playurl: async (aid, bvid, cid, qn, type, platform) => {
            let params = aid != null ? {
                    avid: aid,
                    cid: cid,
                    qn: qn,
                    type: type,
                    platform: platform
                } : {
                    bvid: bvid,
                    cid: cid,
                    qn: qn,
                    type: type,
                    platform: platform
                }
            return axios.get("https://api.bilibili.com/x/player/playurl", {
                params: params,
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取视频信息 定位时间（观看进度）
         * @param {String} cookie Cookie
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @param {Number} cid 视频 cid，用来区分视频列表
         * @returns {Promise}
         */
        player_v2: async (cookie, aid, bvid, cid) => {
            let params = aid != null ? {aid: aid, cid: cid} : {bvid: bvid, cid: cid}
            return axios.get('https://api.bilibili.com/x/player/v2', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取热门列表
         * @returns {Promise}
         */
        popular_series_list: async () => {
            return axios.get('https://api.bilibili.com/x/web-interface/popular/series/list', {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取指定一期
         * @param {Number} number 哪一期
         * @returns {Promise}
         */
        popular_series_one: async (number) => {
            return axios.get('https://api.bilibili.com/x/web-interface/popular/series/one', {
                params: {
                    number: number
                },
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取热门
         * @param {Number} page 页数
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        popular: async (page, cookie) => {
            return axios.get('https://api.bilibili.com/x/web-interface/popular', {
                params: {
                    ps: 20,
                    pn: page
                },
                headers: {
                    "cookie": cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 兑换优惠券
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} type 1: B币、2: 优惠券
         * @returns {Promise}
         */
        privilege_receive: async (cookie, csrf, type) => {
            let data = {
                type: type,
                csrf: csrf
            }
            return axios.post('https://api.bilibili.com/x/vip/privilege/receive', qs.stringify(data), {
                headers: {
                    "cookie": cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取排行
         * @param {Number} rid 排行类型视频
         * @param {String} type 类型
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        ranking: async (rid, type, cookie) => {
            return axios.get('https://api.bilibili.com/x/web-interface/ranking/v2', {
                params: {
                    'rid': rid,
                    'type': type
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取关注大标签中的信息
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        relation_followings: async (mid, page, attention, cookie) => {
            return axios.get('https://api.bilibili.com/x/relation/followings', {
                params: {
                    vmid: mid,
                    pn: page,
                    ps: '20',
                    order: 'desc',
                    order_type: attention, // 排序 ''最新关注, 'attention'最常访问
                    jsonp: 'jsonp'
                },
                headers: {
                    'cookie': cookie,
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取关注小标签中的信息
         * @param {Number} mid 用户mid
         * @param {Number} tagid 标签id
         * @param {Number} page 页数
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        relation_tag: async (mid, tagid, page, cookie) => {
            return axios.get('https://api.bilibili.com/x/relation/tag', {
                params: {
                    mid: mid,
                    tagid: tagid,
                    pn: page,
                    ps: 20,
                    jsonp: 'jsonp'
                },
                headers: {
                    'cookie': cookie,
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取关注标签
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        relation_tags: async (cookie) => {
            return await axios.get('https://api.bilibili.com/x/relation/tags', {
                params: {
                    jsonp: 'jsonp'
                },
                headers: {
                    'cookie': cookie,
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 收藏夹 添加/删除
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} aid 视频 aid
         * @param {Number} media_ids 添加收藏夹id
         * @param {Boolean} add 是否添加
         * @returns {Promise}
         */
        resource_deal: async (cookie, csrf, aid, media_ids, add) => {
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
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取单个收藏夹详细内容
         * @param {Number} page 页数
         * @param {Number} id 收藏夹id
         * @param {String} keyword 搜索关键字
         * @param {String} order 收藏排序
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        resource_list: async (page, id, keyword, order, cookie) => {
            return axios.get('https://api.bilibili.com/x/v3/fav/resource/list', {
                params: {
                    media_id: id,
                    pn: page,
                    ps: 20,
                    keyword: keyword,
                    order: order, // mtime: 最近收藏, view: 最多播放, pubtime: 最新投稿
                    type: 0,
                    tid: 0,
                    platform: 'web',
                    jsonp: 'jsonp'
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
            return res.data.data;
        },
        /**
         * 获取指定 集合id 项目
         * @param {String} cookie Cookie
         * @param {Number} mid UP主mid
         * @param {Number} series_id 集合id
         * @param {Nubmer} pn 请求页
         * @returns {Promise}
         */
        series_archives: async (cookie, mid, series_id, pn) => {
            return axios.get('https://api.bilibili.com/x/series/archives', {
                params: {
                    mid: mid,
                    series_id: series_id,
                    only_normal: true,
                    sort: 'desc', // desc：默认排序、asc：升序排序
                    pn: pn,
                    ps: 30,
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取指定 列表id 项目
         * @param {String} cookie Cookie
         * @param {Number} mid UP主mid
         * @param {Number} season_id 列表id
         * @param {Nubmer} page_num 请求页
         * @returns {Promise}
         */
        seasons_archives_list: async (cookie, mid, season_id, page_num) => {
            return axios.get('https://api.bilibili.com/x/polymer/space/seasons_archives_list', {
                params: {
                    mid: mid,
                    season_id: season_id,
                    sort_reverse: false, // false：默认排序、true：升序排序
                    page_num: page_num,
                    page_size: 30
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取 合集和列表 的每个项目
         * @param {String} cookie Cookie
         * @param {Number} mid UP主mid
         * @param {Number} page_num 请求页数
         * @returns {Promise}
         */
        seasons_series_list: async (cookie, mid, page_num) => {
            return axios.get('https://api.bilibili.com/x/polymer/space/seasons_series_list', {
                params: {
                    mid: mid,
                    page_num: page_num,
                    page_size: 20
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 视频分享
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} aid 视频 aid
         * @returns {Promise}
         */
        share_add: async (cookie, csrf, aid) => {
            let data = {
                aid: aid,
                csrf: csrf
            }
            return axios.post("https://api.bilibili.com/x/web-interface/share/add", qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取用户视频学习
         * @param {Number} mid 用户mid
         * @param {String} order 排序
         * @param {Number} page 页数
         * @returns {Promise}
         */
        space_arc_search: async (mid, order, page) => {
            return axios.get('https://api.bilibili.com/x/space/arc/search', {
                params: {
                    mid: mid,
                    ps: 30,
                    tid: 0, // 0全部 3音乐 129舞蹈 160生活 217动物圈
                    pn: page,
                    keyword: '',
                    order: order, // pubdate: 最新发布, click: 最多播放, stow: 最多收藏
                    jsonp: 'jsonp'
                },
                headers: {
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 首页换一换
         * @param {Number} fresh_type 刷新类型 未知 3
         * @param {Number} version 版本 未知 1
         * @param {Number} ps 一页显示数量 8
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        top_rcmd: async (fresh_type, version, ps, cookie) => {
            return await axios.get('https://api.bilibili.com/x/web-interface/index/top/rcmd', {
                params: {
                    fresh_type: fresh_type,
                    version: version,
                    ps: ps,
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * B币充电
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @param {Number} bp_num 贝壳数
         * @param {Boolean} is_bp_remains_prior 是否优先扣除B币余额
         * @param {Nubmer} up_mid UP主的mid
         * @param {String} otype 充电来源 up：空间充电、archive：视频充电
         * @param {Nubmer} oid 充电来源代码 空间充电：充电对象用户mid、视频充电：稿件avid
         * @returns {Promise}
         */
        trade_elec_pay_quick: async (cookie, csrf, bp_num, is_bp_remains_prior, up_mid, otype, oid) => {
            let data = {
                bp_num: bp_num,
                is_bp_remains_prior: is_bp_remains_prior,
                up_mid: up_mid,
                otype: otype,
                oid: oid,
                csrf: csrf
            }
            return axios.post('https://api.bilibili.com/x/ugcpay/web/v2/trade/elec/pay/quick', qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取视频基本信息
         * @param {String} cookie Cookie
         * @param {Number} aid 视频 aid
         * @param {String} bvid 视频 bvid
         * @returns {Promise}
         */
        view: async (cookie, aid, bvid) => {
            let params = aid != null ? {aid: aid} : {bvid: bvid}
            return axios.get('https://api.bilibili.com/x/web-interface/view', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取 优惠券 和 B币券
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        vip_privilege: async (cookie) => {
            return axios.get('https://api.bilibili.com/x/vip/privilege/my', {
                headers: {
                    'cookie': cookie,
                    'referer': 'https://space.bilibili.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取直播间信息
         * @param {Number} size 获取多少直播间
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        w_live_users: async (size, cookie) => {
            return axios.get('https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users', {
                params: {
                    size: size
                },
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取钱包中的信息
         * @param {String} cookie 请求Cookie
         * @returns {Promise}
         */
        wallet_getStatus: async (cookie) => {
            return axios.get('https://api.live.bilibili.com/xlive/revenue/v1/wallet/getStatus', {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 银币转硬币
         * @param {String} cookie Cookie
         * @param {String} csrf 用户验证
         * @returns {Promise}
         */
        wallet_silver2coin: async (cookie, csrf) => {
            let data = {
                csrf_token: csrf,
                csrf: csrf
            }
            return axios.post('https://api.live.bilibili.com/xlive/revenue/v1/wallet/silver2coin', qs.stringify(data), {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        }
    }
}