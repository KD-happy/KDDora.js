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
     * ??????????????????????????????????????????
     * @param {Number} author_mid ??????mid
     */
    async pcs(author_mid) {
        let selected = await $input.select({
            title: 'UP??????????????????',
            options: [
                {value: 'pubdate', title: '????????????: pubdate'},
                {value: 'click', title: '????????????: click'},
                {value: 'stow', title: '????????????: stow'}
            ]
        })
        if (selected != null) {
            $router.to($route('list/space_video', {
                mid: author_mid, order: selected.value
            }))
        }
    },
    /**
     * ?????????????????????????????????????????????
     * @param {Number} aid ?????? aid
     * @param {String} bvid ?????? bvid
     * @param {Boolean} deal ????????????
     */
    async lad(aid, bvid, deal) {
        let options = []
        options.push({value: 'player', title: '??????'})
        options.push({value: 'like', title: '??????'})
        options.push({value: 'add', title: '??????'})
        options.push(deal ? {value: 'deal', title: '????????????'} : {value: 'deal', title: '????????????'})
        options.push({value: 'history', title: '??????????????????'})
        selected = await $input.select({
            title: '????????????',
            options: options
        })
        if (selected != null) {
            if (selected.value == 'player') {
                $router.to($route('play', {aid: aid, bvid: bvid}))
            } else if (selected.value == 'like') {
                api.archive_like(cookie, csrf, aid, bvid, 1).then(res => {
                    $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                })
            } else if (selected.value == 'add') {
                let pd = false, go = true
                await api.archive_relation(cookie, aid, bvid).then(async res => {
                    if (res.data.code == 0 && res.data.data.coin < 2) {
                        pd = await $input.confirm({
                            title: "????????????",
                            message: res.data.data.coin>0 ? `?????????????????? ${res.data.data.coin} ???` : "????????????????????????",
                            okBtn: '??????'
                        })
                    } else {
                        go = false
                        $ui.toast(`?????????????????????~`)
                    }
                })
                if (pd) {
                    api.coin_add(cookie, csrf, aid, bvid, 1, 0).then(res => {
                        $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                    })
                } else if (go) {
                    $ui.toast("????????????")
                }
            } else if (selected.value == 'deal') {
                if (deal) {
                    let list = await api.folder_created_list_all(mid, cookie, aid).then(res => {
                        return res.data.data == null ? false : res.data.data.list;
                    })
                    let selected = await $input.select({
                        title: '?????????????????????*???????????????',
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
                            $ui.toast("??????????????????")
                            await lad(aid, bvid, author_mid, deal_id, deal)
                        } else {
                            api.resource_deal(cookie, csrf, aid, selected.id, deal).then(res => {
                                $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                            })
                        }
                    } else {
                        $ui.toast("????????????")
                    }
                } else {
                    let pd = await $input.confirm({
                        title: "????????????",
                        message: "??????????????????",
                        okBtn: '??????'
                    })
                    if (pd) {
                        api.resource_deal(cookie, csrf, aid, deal_id, deal).then(res => {
                            $ui.toast(res.data.code == 0 ? "??????????????????" : res.data.message)
                        })
                    } else {
                        $ui.toast("?????? ????????????")
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
                        $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                    })
                } else {
                    $ui.toast("???????????? ????????????~")
                }
            }
        }
    },
    /**
     * ????????????????????????????????????????????????????????????????????????????????????????????????
     * @param {Number} aid ?????? aid
     * @param {String} bvid ?????? bvid
     * @param {Number} author_mid ??????mid
     * @param {Number} deal_id ?????????id
     * @param {Boolean} deal ????????????
     * @param {Boolean} toview ??????????????????
     */
    async pcslad(aid, bvid, author_mid, deal_id, deal, toview) {
        let options = []
        options.push({value: 'pubdate', title: '????????????: pubdate'})
        options.push({value: 'click', title: '????????????: click'})
        options.push({value: 'stow', title: '????????????: stow'})
        options.push({value: 'player', title: '??????'})
        options.push({value: 'like', title: '??????'})
        options.push({value: 'add', title: '??????'})
        options.push(deal ? {value: 'deal', title: '????????????'} : {value: 'deal', title: '????????????'})
        options.push(toview ? {value: 'toview', title: '??????????????????'} : {value: 'toview', title: '??????????????????'})
        selected = await $input.select({
            title: '????????????',
            options: options
        })
        if (selected != null) {
            if (selected.value == 'player') {
                $router.to($route('play', {aid: aid, bvid: bvid}))
            } else if (selected.value == 'pubdate' || selected.value == 'click' || selected.value == 'stow') {
                $router.to($route('list/space_video', {
                    mid: author_mid, order: selected.value
                }))
            } else if(selected.value == 'like') {
                api.archive_like(cookie, csrf, aid, bvid, 1).then(res => {
                    $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                })
            } else if(selected.value == 'add') {
                let pd = false, go = true
                await api.archive_relation(cookie, aid, bvid).then(async res => {
                    if (res.data.code == 0 && res.data.data.coin < 2) {
                        pd = await $input.confirm({
                            title: "????????????",
                            message: res.data.data.coin>0 ? `?????????????????? ${res.data.data.coin} ???` : "????????????????????????",
                            okBtn: '??????'
                        })
                    } else {
                        go = false
                        $ui.toast(`?????????????????????~`)
                    }
                })
                if (pd) {
                    api.coin_add(cookie, csrf, aid, bvid, 1, 0).then(res => {
                        $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                    })
                } else if (go) {
                    $ui.toast("????????????")
                }
            } else if (selected.value == 'deal') {
                if (deal) {
                    let list = await api.folder_created_list_all(mid, cookie, aid).then(res => {
                        return res.data.data == null ? false : res.data.data.list;
                    })
                    let selected = await $input.select({
                        title: '?????????????????????*???????????????',
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
                            $ui.toast("??????????????????")
                            await pcslad(aid, bvid, author_mid, deal_id, deal, true)
                        } else {
                            api.resource_deal(cookie, csrf, aid, selected.id, deal).then(res => {
                                $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                            })
                        }
                    } else {
                        $ui.toast("????????????")
                    }
                } else {
                    let pd = await $input.confirm({
                        title: "????????????",
                        message: "??????????????????",
                        okBtn: '??????'
                    })
                    if (pd) {
                        api.resource_deal(cookie, csrf, aid, deal_id, deal).then(res => {
                            $ui.toast(res.data.code == 0 ? "??????????????????" : res.data.message)
                        })
                    } else {
                        $ui.toast("?????? ????????????")
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
                            $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                        })
                    } else {
                        $ui.toast("???????????? ????????????~")
                    }
                } else {
                    api.history_toview_del(cookie, this.csrf, aid, bvid).then(res => {
                        $ui.toast(res.data.code == 0 ? "????????????" : res.data.message)
                    })
                }
            }
        }
    }
}