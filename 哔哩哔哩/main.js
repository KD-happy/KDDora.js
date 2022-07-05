const API = require("./components/API/API");
const api = API();

if (typeof $dora == 'undefined') {
    console.error('This project runs only in Dora.js.')
    console.error('Please visit https://dorajs.com/ for more information.')
    process.exit(-1)
}

console.info('Congratulation, your addon runs successfully!')

module.exports = {
    async getCookie() {
        var userlist = $storage.get("userlist");
        var order = $storage.get("order");
        this.top = $storage.get("top") == undefined ? false && $storage.put("top", false) : $storage.get("top")
        if (order == null) {
            $storage.put("order", "mtime");
            this.order = "mtime";
        } else {
            this.order = order;
        }
        var go = true, cookie = "", mid = 0, csrf = '';
        if (userlist == null) {
            userlist = [];
            $storage.put("userlist", userlist);
        }
        if (userlist.length > 0) {
            userlist.forEach(f => {
                if (f.is_login) {
                    go = false;
                    cookie = f.cookie;
                    csrf = f.csrf;
                    mid = f.mid;
                }
            });
            if (userlist.length >= 0 && go) {
                userlist[0].is_login = true;
                cookie = userlist[0].cookie;
                csrf = userlist[0].csrf;
                mid = userlist[0].mid;
                $storage.put("userlist", userlist);
            }
        }
        this.cookie = cookie;
        this.mid = mid;
        this.csrf = csrf;
    },
    top: false,
    cookie: "",
    mid: 0,
    csrf: '',
    order: '',
    formateTimeStamp(time) {
        var date = new Date();
        date.setTime(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours()< 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes()< 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds()< 10 ? "0" + date.getSeconds() : date.getSeconds();
        return year + "-" + month + "-" + day+" "+hour+":"+minute+":"+second;
    },
    /**
     * 最新发布、最多播放、最多收藏
     * @param {Number} author_mid 作者mid
     */
    async pcs(author_mid) {
        let selected = await $input.select({
            title: 'UP视频排列顺序',
            options: [
                {value: 'pubdate', title: '最新发布: pubdate'},
                {value: 'click', title: '最多播放: click'},
                {value: 'stow', title: '最多收藏: stow'}
            ]
        })
        if (selected != null) {
            $router.to($route('list/space_video', {
                mid: author_mid, order: selected.value
            }))
        }
    },
    /**
     * 点赞、投币、收藏视频、稍后再看
     * @param {Number} aid 视频 aid
     * @param {String} bvid 视频 bvid
     * @param {Boolean} deal 是否收藏
     */
    async lad(aid, bvid, deal) {
        let options = []
        options.push({value: 'like', title: '点赞'})
        options.push({value: 'add', title: '投币'})
        options.push(deal ? {value: 'deal', title: '收藏视频'} : {value: 'deal', title: '取消收藏'})
        options.push({value: 'history', title: '添加稍后再看'})
        selected = await $input.select({
            title: '更多操作',
            options: options
        })
        if (selected != null) {
            if (selected.value == 'like') {
                api.archive_like(cookie, csrf, aid, bvid, 1).then(res => {
                    $ui.toast(res.data.code == 0 ? "点赞成功" : res.data.message)
                })
            } else if (selected.value == 'add') {
                let pd = false, go = true
                await api.archive_relation(cookie, aid, bvid).then(async res => {
                    if (res.data.code == 0 && res.data.data.coin < 2) {
                        pd = await $input.confirm({
                            title: "是否投币",
                            message: res.data.data.coin>0 ? `当前视频已投 ${res.data.data.coin} 币` : "当前视频还未投币",
                            okBtn: '确定'
                        })
                    } else {
                        go = false
                        $ui.toast(`超过投币上限啦~`)
                    }
                })
                if (pd) {
                    api.coin_add(cookie, csrf, aid, bvid, 1, 0).then(res => {
                        $ui.toast(res.data.code == 0 ? "投币成功" : res.data.message)
                    })
                } else if (go) {
                    $ui.toast("取消投币")
                }
            } else if (selected.value == 'deal') {
                if (deal) {
                    let list = await api.folder_created_list_all(mid, cookie, aid)
                    let selected = await $input.select({
                        title: '选择收藏位置（*添加了的）',
                        options: list.map(m => {
                            if (m.fav_state == 1) {
                                m.title = `${m.title} *`
                                return m
                            } else {
                                return m
                            }
                        })
                    })
                    if (selected != null) {
                        if (selected.fav_state == 1) {
                            $ui.toast("已经添加过了")
                            await lad(aid, bvid, author_mid, deal_id, deal)
                        } else {
                            api.resource_deal(cookie, csrf, aid, selected.id, deal).then(res => {
                                $ui.toast(res.data.code == 0 ? "收藏成功" : res.data.message)
                            })
                        }
                    } else {
                        $ui.toast("取消收藏")
                    }
                } else {
                    let pd = await $input.confirm({
                        title: "取消收藏",
                        message: "是否取消收藏",
                        okBtn: '确定'
                    })
                    if (pd) {
                        api.resource_deal(cookie, csrf, aid, deal_id, deal).then(res => {
                            $ui.toast(res.data.code == 0 ? "取消收藏成功" : res.data.message)
                        })
                    } else {
                        $ui.toast("取消 取消收藏")
                    }
                }
            } else if (selected.value == 'history') {
                let pd = true
                await api.history_toview(cookie).then(res => {
                    res.data.data.list.forEach(f => {
                        if (f.aid == aid || f.bvid == bvid) {
                            pd = false
                        }
                    })
                })
                if (pd) {
                    api.history_toview_add(cookie, csrf, aid, bvid).then(res => {
                        $ui.toast(res.data.code == 0 ? "添加成功" : res.data.message)
                    })
                } else {
                    $ui.toast("稍后再看 早已存在~")
                }
            }
        }
    },
    /**
     * 最新发布、最多播放、最多收藏、点赞、投币、收藏视频、添加稍后再看
     * @param {Number} aid 视频 aid
     * @param {String} bvid 视频 bvid
     * @param {Number} author_mid 用户mid
     * @param {Number} deal_id 收藏夹id
     * @param {Boolean} deal 是否收藏
     * @param {Boolean} toview 是否稍后再看
     */
    async pcslad(aid, bvid, author_mid, deal_id, deal, toview) {
        let options = []
        options.push({value: 'pubdate', title: '最新发布: pubdate'})
        options.push({value: 'click', title: '最多播放: click'})
        options.push({value: 'stow', title: '最多收藏: stow'})
        options.push({value: 'like', title: '点赞'})
        options.push({value: 'add', title: '投币'})
        options.push(deal ? {value: 'deal', title: '收藏视频'} : {value: 'deal', title: '取消收藏'})
        options.push(toview ? {value: 'toview', title: '添加稍后再看'} : {value: 'toview', title: '删除稍后再看'})
        selected = await $input.select({
            title: '更多操作',
            options: options
        })
        if (selected != null) {
            if (selected.value == 'pubdate' || selected.value == 'click' || selected.value == 'stow') {
                $router.to($route('list/space_video', {
                    mid: author_mid, order: selected.value
                }))
            } else if(selected.value == 'like') {
                api.archive_like(cookie, csrf, aid, bvid, 1).then(res => {
                    $ui.toast(res.data.code == 0 ? "点赞成功" : res.data.message)
                })
            } else if(selected.value == 'add') {
                let pd = false, go = true
                await api.archive_relation(cookie, aid, bvid).then(async res => {
                    if (res.data.code == 0 && res.data.data.coin < 2) {
                        pd = await $input.confirm({
                            title: "是否投币",
                            message: res.data.data.coin>0 ? `当前视频已投 ${res.data.data.coin} 币` : "当前视频还未投币",
                            okBtn: '确定'
                        })
                    } else {
                        go = false
                        $ui.toast(`超过投币上限啦~`)
                    }
                })
                if (pd) {
                    api.coin_add(cookie, csrf, aid, bvid, 1, 0).then(res => {
                        $ui.toast(res.data.code == 0 ? "投币成功" : res.data.message)
                    })
                } else if (go) {
                    $ui.toast("取消投币")
                }
            } else if (selected.value == 'deal') {
                if (deal) {
                    let list = await api.folder_created_list_all(mid, cookie, aid)
                    let selected = await $input.select({
                        title: '选择收藏位置（*添加了的）',
                        options: list.map(m => {
                            if (m.fav_state == 1) {
                                m.title = `${m.title} *`
                                return m
                            } else {
                                return m
                            }
                        })
                    })
                    if (selected != null) {
                        if (selected.fav_state == 1) {
                            $ui.toast("已经添加过了")
                            await pcslad(aid, bvid, author_mid, deal_id, deal, true)
                        } else {
                            api.resource_deal(cookie, csrf, aid, selected.id, deal).then(res => {
                                $ui.toast(res.data.code == 0 ? "收藏成功" : res.data.message)
                            })
                        }
                    } else {
                        $ui.toast("取消收藏")
                    }
                } else {
                    let pd = await $input.confirm({
                        title: "取消收藏",
                        message: "是否取消收藏",
                        okBtn: '确定'
                    })
                    if (pd) {
                        api.resource_deal(cookie, csrf, aid, deal_id, deal).then(res => {
                            $ui.toast(res.data.code == 0 ? "取消收藏成功" : res.data.message)
                        })
                    } else {
                        $ui.toast("取消 取消收藏")
                    }
                }
            } else if (selected.value == 'toview') {
                if (toview) {
                    let pd = true
                    await api.history_toview(cookie).then(res => {
                        res.data.data.list.forEach(f => {
                            if (f.aid == aid || f.bvid == bvid) {
                                pd = false
                            }
                        })
                    })
                    if (pd) {
                        api.history_toview_add(cookie, csrf, aid, bvid).then(res => {
                            $ui.toast(res.data.code == 0 ? "添加成功" : res.data.message)
                        })
                    } else {
                        $ui.toast("稍后再看 早已存在~")
                    }
                } else {
                    api.history_toview_del(cookie, this.csrf, aid, bvid).then(res => {
                        $ui.toast(res.data.code == 0 ? "删除成功" : res.data.message)
                    })
                }
            }
        }
    }
}