const axios = require("axios");
const qs = require("qs");

module.exports = () => {
    return {
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
            var params = {
                mid: mid,
                ps: 30,
                tid: 0,
                pn: pn,
                keyword: keyword,
                order: order,
            }
            return axios.get('https://api.bilibili.com/x/space/arc/search', {
                params: params,
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
        },
        /**
         * 日历 - 加入时间
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        calendar_event: async (cookie) => {
            var url = "https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0";
            var headers = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                'cookie': cookie
            }
            try {
                var res = await axios.get(url, {
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.data.pfs == null) {
                return false;
            } else {
                return res.data.data.pfs;
            }
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
         * @returns {Object}
         */
        dynamic_history: async (mid, dynamic_id, cookie) => {
            var url = 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history';
            var params = {
                'uid': mid,
                'offset_dynamic_id': dynamic_id,
                'type': 8,
                'from': '',
                'platform': 'web'
            }
            var headers = {
                'cookie': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
            try {
                var res = await axios.get(url, {
                    params: params,
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data.cards;
            } else {
                return false;
            }
        },
        /**
         * 动态信息 -- 第一次请求
         * @param {Number} mid 用户mid
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        dynamic_new: async (mid, cookie) => {
            var url = "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new";
            var params = {
                'uid': mid,
                'type_list': 8,
                'from': '',
                'platform': 'web'
            }
            var headers = {
                'cookie': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
            try {
                var res = await axios.get(url, {
                    params: params,
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data.cards;
            } else {
                return false;
            }
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
         * @returns {Object}
         */
        exp_reward: async (cookie) => {
            var url = "https://api.bilibili.com/x/member/web/exp/reward";
            var headers = {
                'cookie': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
            try {
                var res = await axios.get(url, {
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data;
            } else {
                return false;
            }
        },
        /**
         * 获取全部收藏夹信息 标签
         * @param {Number} mid 用户mid
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        folder_created_list_all: async (mid, cookie) => {
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
        },
        /**
         * 获取历史列表
         * @param {Object} params 请求参数
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        history_cursor: async (params, cookie) => {
            var url = 'https://api.bilibili.com/x/web-interface/history/cursor';
            var headers = {
                'cookie': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
            try {
                var res = await axios.get(url, {
                    params: params,
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data;
            } else {
                return false;
            }
        },
        /**
         * 历史搜索
         * @param {Number} pn 页数
         * @param {String} keyword 搜索关键字
         * @param {String} cookie Cookie
         * @returns {Promise}
         */
        history_search: async (pn, keyword, cookie) => {
            var params = {
                pn: pn,
                keyword: keyword,
                business: 'all',
            }
            return axios.get('https://api.bilibili.com/x/web-goblin/history/search', {
                params: params,
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
        },
        /**
         * 获取用户信息
         * @param {Number} mid 用户mid
         * @returns {Object}
         */
        info: async (mid) => {
            var url = `https://api.bilibili.com/x/space/acc/info?mid=${mid}&jsonp=jsonp`;
            var res = await axios.get(url, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
            return res.data.data;
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
         * 获取关注人数、粉丝数
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        nav_stat: async (cookie) => {
            var url = "https://api.bilibili.com/x/web-interface/nav/stat";
            var headers = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                'cookie': cookie
            }
            try {
                var res = await axios.get(url, {
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data;
            } else {
                return false;
            }
        },
        /**
         * 导航个人信息
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        nav: async (cookie) => {
            var url = "https://api.bilibili.com/x/web-interface/nav";
            var headers = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                'cookie': cookie
            }
            try {
                var res = await axios.get(url, {
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data;
            } else {
                return false;
            }
        },
        /**
         * 获取热门列表
         * @returns {Object}
         */
        popular_series_list: async () => {
            var url = 'https://api.bilibili.com/x/web-interface/popular/series/list';
            var res = await axios.get(url);
            return res.data.data.list;
        },
        /**
         * 获取指定一期
         * @param {Number} number 哪一期
         * @returns 
         */
        popular_series_one: async (number) => {
            var url = `https://api.bilibili.com/x/web-interface/popular/series/one?number=${number}`;
            var res = await axios.get(url);
            return res.data.data.list;
        },
        /**
         * 获取热门
         * @param {Number} page 页数
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        popular: async (page, cookie) => {
            var url = `https://api.bilibili.com/x/web-interface/popular?ps=20&pn=${page}`;
            var res = await axios.get(url, {
                headers: {
                    "cookie": cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            });
            return res.data.data.list;
        },
        /**
         * 获取排行
         * @param {Number} rid 排行类型视频
         * @param {String} type 类型
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        ranking: async (rid, type, cookie) => {
            var url = "https://api.bilibili.com/x/web-interface/ranking/v2";
            var headers = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                'cookie': cookie
            }
            var params = {
                'rid': rid,
                'type': type
            }
            try {
                var res = await axios.get(url, {
                    params: params,
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data.list;
            } else {
                return false;
            }
        },
        /**
         * 获取关注大标签中的信息
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        relation_followings: async (mid, page, attention, cookie) => {
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
        },
        /**
         * 获取关注小标签中的信息
         * @param {Number} mid 用户mid
         * @param {Number} tagid 标签id
         * @param {Number} page 页数
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        relation_tag: async (mid, tagid, page, cookie) => {
            var url = "https://api.bilibili.com/x/relation/tag";
            var params = {
                mid: mid,
                tagid: tagid,
                pn: page,
                ps: 20,
                jsonp: 'jsonp'
            }
            try {
                var res = await axios.get(url, {
                    params: params,
                    headers: {
                        'cookie': cookie,
                        'referer': 'https://space.bilibili.com/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data;
            } else {
                return false;
            }
        },
        /**
         * 获取关注标签
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        relation_tags: async (cookie) => {
            var url = "https://api.bilibili.com/x/relation/tags";
            var params = {
                jsonp: 'jsonp'
            }
            try {
                var res = await axios.get(url, {
                    params: params,
                    headers: {
                        'cookie': cookie,
                        'referer': 'https://space.bilibili.com/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data;
            } else {
                return false;
            }
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
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    'cookie': cookie
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
         * @returns {Object}
         */
        resource_list: async (page, id, keyword, order, cookie) => {
            var url = 'https://api.bilibili.com/x/v3/fav/resource/list';
            var params = {
                media_id: id,
                pn: page,
                ps: 20,
                keyword: keyword,
                order: order, // mtime: 最近收藏, view: 最多播放, pubtime: 最新投稿
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
        },
        /**
         * 获取用户视频学习
         * @param {Number} mid 用户mid
         * @param {String} order 排序
         * @param {Number} page 页数
         * @returns {Object}
         */
        space_arc_search: async (mid, order, page) => {
            var url = 'https://api.bilibili.com/x/space/arc/search';
            var params = {
                mid: mid,
                ps: 30,
                tid: 0, // 0全部 3音乐 129舞蹈 160生活 217动物圈
                pn: page,
                keyword: '',
                order: order, // pubdate: 最新发布, click: 最多播放, stow: 最多收藏
                jsonp: 'jsonp'
            }
            try {
                var res = await axios.get(url, {
                    params: params,
                    headers: {
                        'referer': 'https://space.bilibili.com/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                    }
                });
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.data.list.vlist;
        },
        /**
         * 首页换一换
         * @param {Number} fresh_type 刷新类型 未知 3
         * @param {Number} version 版本 未知 1
         * @param {Number} ps 一页显示数量 8
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        top_rcmd: async (fresh_type, version, ps, cookie) => {
            var url = `https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3&version=1&ps=8`;
            var headers = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                'cookie': cookie
            }
            try {
                var res = await axios.get(url, {
                    headers: headers
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.data.item;
        },
        /**
         * 获取 优惠券 和 B币券
         * @param {String} cookie Cookie
         * @returns {Object}
         */
        vip_privilege: async (cookie) => {
            var url = "https://api.bilibili.com/x/vip/privilege/my";
            try {
                var res = await axios.get(url, {
                    headers: {
                        'cookie': cookie,
                        'referer': 'https://space.bilibili.com/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            if (res.data.code == 0) {
                return res.data.data.list;
            } else {
                return false;
            }
        },
        /**
         * 获取直播间信息
         * @param {Number} size 获取多少直播间
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        w_live_users: async (size, cookie) => {
            var url =  `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users?size=${size}`;
            var res = await axios.get(url, {
                headers: {
                    'cookie': cookie,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            })
            return res.data.data;
        },
        /**
         * 获取钱包中的信息
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        wallet_getStatus: async (cookie) => {
            var url = "https://api.live.bilibili.com/xlive/revenue/v1/wallet/getStatus"
            var headers = {
                'cookie': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
            return await axios.get(url, {
                headers: headers
            }).then(res => {
                return res.data.data
            }).catch(err => {
                console.log("请求错误！")
                return false
            })
        }
    }
}