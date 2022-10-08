const API = require("./API/API");
const api = API();

var that;

function formatUtcTime(v) { // 时间格式化
    if (!v) {
        return ''
    }
    let date = new Date(v);
    date = new Date(date.valueOf());
    return date.getFullYear() +
        "-" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
        "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        " " + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ":" + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
}

function formatUtcTimes(v) { // 时间格式化
    if (!v) {
        return ''
    }
    let date = new Date(v);
    date = new Date(date.valueOf());
    return date.getFullYear() +
        "-" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
        "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
}

function hasId(mid) {
    var userlist = $storage.get("userlist");
    if (userlist.length > 0) {
        for (var i=0; i<userlist.length; i++) {
            if (userlist[i].mid == mid) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}

function changLogin(mid) {
    let userlist = $storage.get("userlist");
    userlist.forEach(f => {
        if (f.mid == mid) {
            f.is_login = true;
        } else {
            f.is_login = false;
        }
    })
    $storage.put("userlist", userlist);
    that.refresh();
}

async function deleteLogin(m) { // 删除用户
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否删除用户: ${m.name}\n用户MID: ${m.mid}`,
        okBtn: "删除"
    })
    if (pd) {
        let userlist = $storage.get("userlist");
        let new_userlist = [];
        userlist.forEach(f => {
            if (f.mid != m.mid) {
                new_userlist.push(f);
            }
        })
        $storage.put("userlist", new_userlist);
        $ui.toast("删除成功");
        that.refresh();
    } else {
        $ui.toast("取消删除");
    }
}

async function showConfig(m) { // 显示配置
    $ui.showCode(JSON.stringify(m, null, ' '));
}

async function attribute(m) { // 属性
    $ui.showCode(`用户MID: ${m.mid}\n用户名: ${m.name}\nCookie: ${m.cookie}\ncsrf: ${m.csrf}`);
}

async function sorting(m) { // 切换排序
    var userlist = $storage.get("userlist");
    var new_userlist = [], new_index=[], sort, sort_index;
    userlist.forEach((f, i) => {
        if (f.mid != m.mid)  {
            new_userlist.push(f);
            new_index.push({
                title: `切换到第 ${i+1}`,
                value: i
            });
        } else {
            sort = f;
            sort_index = i;
        }
    })
    var selected = await $input.select({
        title: `当前排序为第 ${sort_index+1}`,
        options: new_index
    })
    if (selected != null) {
        new_userlist.splice(selected.value, 0, sort);
        $storage.put("userlist", new_userlist);
        $ui.toast("切换成功");
        that.refresh();
    } else {
        $ui.toast("取消切换");
    }
}

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 个人信息和配置',
    async fetch() {
        that = this;
        getCookie();
        var userlist = $storage.get("userlist");
        var [info, info1, info2, info3, info4, info5, info6] = await $axios.all([
                api.nav(cookie),
                api.nav_stat(cookie),
                api.calendar_event(cookie),
                api.exp_reward(cookie),
                api.vip_privilege(cookie),
                api.wallet_getStatus(cookie),
                api.dynamic_region(cookie, 1, 6, 1)
            ])
        info = info.data.code == 0 ? info.data.data : false;
        info1 = info1.data.code == 0 ? info1.data.data : false;
        info2 = info2.data.data.pfs != null ? info2.data.data.pfs : false;
        info3 = info3.data.code == 0 ? info3.data.data : false;
        info4 = info4.data.code == 0 ? info4.data.data.list : false;
        info5 = info5.data.code == 0 ? info5.data.data : false;
        var data = [];
        data.push({title: "当前用户",style: 'category'})
        if (info != false) {
            data.push({style: 'simple',thumb: info.face,title: `用户名: ${info.uname}`,summary: `用户MID: ${info.mid}`})
            if (info.vipStatus == 1) {var vip = `会员到期时间: ${formatUtcTime(info.vipDueDate)}\n`;} else {var vip = `非会员\n`;}
            data.push({
                style: 'article',
                title: "用户详细信息",
                time: `${formatUtcTime(new Date().getTime())}`,
                summary: `${vip}入站时间: ${formatUtcTime(info2.profile.jointime*1000)}\n当前等级: ${info.level_info.current_level}  等级经验: ${info.level_info.current_exp}/${info.level_info.next_exp}\n关注数: ${info1.following}  粉丝数: ${info1.follower}   节操值: ${info.moral}`
            });
            data.push({
                style: 'article',
                title: '经验任务',
                summary: `硬币: ${info.money}  B币: ${info.wallet.bcoin_balance}  银币: ${info5.silver}  剩银币转硬币: ${info5.silver_2_coin_left}\n每日登录: ${info3.login ? "完成" : "未完成"},  每日观看: ${info3.watch ? "完成" : "未完成"}\n每日分享: ${info3.share ? "完成" : "未完成"},  投币次数: ${info3.coins/10}次`
            })
            data.push({
                style: 'article',
                title: '兑换详细信息',
                summary: `B币券: ${info4[0].state == 1 ? `已领取 - 剩余 ${info.wallet.coupon_balance}` : "未领取"}  优惠券: ${info4[1].state == 1 ? "已领取" : "未领取"}\n距下一轮兑换截止时间戳\nB币券: ${formatUtcTimes(info4[0].period_end_unix*1000)}  优惠券: ${formatUtcTimes(info4[1].period_end_unix*1000)}`
            })
        } else {
            data.push({style: 'simple',thumb: "",title: "用户名: 游客", summary: "用户mid: 0"});
            data.push({style: 'article',title: "用户详细信息",time: `${formatUtcTime(new Date().getTime())}`,summary: "请登录"});
        }
        data.push({title: "登录操作",style: 'category'})
        data.push({
            title: "登录",
            spanCount: 4,
            route: $route("web_login")
        })
        data.push({
            title: "添加Cookie",
            spanCount: 4,
            onClick: async () => {
                var myCookie = await $input.text({
                    title: "添加Cookie",
                    hint: "请输入Cookie",
                    value: ""
                })
                if (myCookie != null) {
                    if (myCookie.includes("SESSDATA") == false) {
                        myCookie = "SESSDATA=" + myCookie;
                    }
                    var user = await api.nav(myCookie);
                    user = user.data.code == 0 ? user.data.data : false;
                    if (user != false) {
                        if (hasId(user.mid)) {
                            $ui.toast("mid重复, 添加失败");
                        } else {
                            userlist.push({
                                mid: user.mid,
                                name: user.uname,
                                face: user.face,
                                cookie: myCookie,
                                is_login: false
                            })
                            $storage.put("userlist", userlist);
                            $ui.toast("登录成功, 添加列表成功");
                            this.refresh();
                        }
                    } else {
                        $ui.toast("添加失败, Cookie失效");
                    }
                } else {
                    $ui.toast("取消添加");
                }
            }
        })
        data.push({
            title: "添加csrf",
            spanCount: 4,
            onClick: async () => {
                let myCsrf = await $input.text({
                    title: "添加csrf",
                    hint: "请输入csrf",
                    value: ""
                })
                if (myCsrf != null) {
                    userlist.forEach(f => {
                        if (f.is_login) {
                            f.csrf = myCsrf
                        }
                    })
                    $storage.put("userlist", userlist);
                    $ui.toast("添加成功");
                    this.refresh();
                } else {
                    $ui.toast("取消添加");
                }
            }
        })
        data.push({title: "任务操作", style: "category"})
        data.push({
            title: "签到",
            spanCount: 2,
            onClick: async () => {
                let toast = ""
                await api.live_sign(cookie).then(res => {
                    console.log("直播签到")
                    console.log(res.data)
                    toast = res.data.code == 0 ? res.data.data.text : res.data.message
                })
                await api.manga_ClockIn(cookie).then(res => {
                    console.log("漫画签到")
                    console.log(res.data)
                    toast += '\n签到成功'
                }).catch(err => {
                    console.log(err.toJSON())
                    toast += '\n今日已签 or cookie已失效'
                })
                $ui.toast(toast)
                this.refresh()
            }
        })
        data.push({
            title: "观看视频",
            spanCount: 3,
            onClick: async () => {
                let aid = info6.data.data.archives[0].aid
                let cid = info6.data.data.archives[0].cid
                let title = info6.data.data.archives[0].title
                console.log(title, aid, cid)
                api.history_report(cookie, csrf, aid, cid).then(res => {
                    console.log(res.data)
                    $ui.toast(res.data.code == 0 ? "观看视频成功" : res.data.message)
                    this.refresh()
                })
            }
        })
        data.push({
            title: "分享视频",
            spanCount: 3,
            onClick: async () => {
                let aid = info6.data.data.archives[0].aid
                let cid = info6.data.data.archives[0].cid
                let title = info6.data.data.archives[0].title
                console.log(title, aid, cid)
                api.share_add(cookie, csrf, aid).then(res => {
                    console.log(res.data)
                    $ui.toast(res.data.code == 0 ? "分享视频成功" : res.data.message)
                    this.refresh()
                })
            }
        })
        data.push({
            title: "银币to硬币",
            spanCount: 4,
            onClick: async () => {
                if (info5.silver_2_coin_left > 0) {
                    await api.wallet_silver2coin(cookie, csrf).then(res => {
                        console.log(res.data)
                        $ui.toast(res.data.code == 0 ? "兑换成功" : res.data.message)
                        this.refresh();
                    })
                } else {
                    $ui.toast("今日已兑换")
                }
            }
        })
        if (info4[0].state == 0 || info4[1].state == 0 || info.wallet.coupon_balance > 0) {
            data.push({title: "会员鼓励兑换",style: 'category'})
        }
        info4[0].state == 0 && data.push({
            title: 'B币兑换',
            spanCount: 4,
            onClick: () => {
                api.privilege_receive(cookie, csrf, 1).then(res => {
                    if (res.data.code == 0) {
                        $ui.toast("兑换成功")
                        this.refresh()
                    } else {
                        $ui.toast(res.data.message)
                    }
                })
            }
        })
        info4[1].state == 0 && data.push({
            title: '优惠券兑换',
            spanCount: 4,
            onClick: () => {
                api.privilege_receive(cookie, csrf, 2).then(res => {
                    if (res.data.code == 0) {
                        $ui.toast("兑换成功")
                        this.refresh()
                    } else {
                        $ui.toast(res.data.message)
                    }
                })
            }
        })
        info.wallet.coupon_balance > 0 && data.push({
            title: '充电',
            spanCount: 4,
            onClick: async () => {
                let up_mid = await $input.number({
                    title: "充电（默认是自己的mid）",
                    hint: "请输入充电UP主的mid",
                    value: mid
                })
                if (up_mid != null) {
                    let up_name = ""
                    await api.info(up_mid).then(res => {
                        up_name = res.data.data != undefined ? res.data.data.name : "啥都木有"
                    })
                    let bp_num = await $input.number({
                        title: "要充电的B币 - 默认全部B币券",
                        hint:  `将为TA ${up_name} 充电`,
                        value: info.wallet.coupon_balance
                    })
                    if (bp_num != null) {
                        api.trade_elec_pay_quick(cookie, csrf, bp_num, true, up_mid, 'up', up_mid).then(res => {
                            if (res.data.code == 0) {
                                if (res.data.data.status > 0) {
                                    $ui.toast("充电成功")
                                } else {
                                    $ui.toast(res.data.data.msg)
                                }
                            } else {
                                $ui.toast(res.data.message)
                            }
                        })
                    } else {
                        $ui.toast("取消充电")
                    }
                } else {
                    $ui.toast("取消充电")
                }
            }
        })
        data.push({title: "用户列表操作",style: 'category'})
        data.push({
            title: "删除所有用户",
            spanCount: 6,
            onClick: async () => {
                let pd = await $input.confirm({
                    title: "确认框",
                    message: `是否删除所有用户`,
                    okBtn: "删除"
                })
                if (pd) {
                    $storage.put("userlist", []);
                    $ui.toast("删除成功");
                } else {
                    $ui.toast("取消删除");
                }
            }
        })
        data.push({
            title: "清除失效用户",
            spanCount: 6,
            onClick: async () => {
                let userlist = $storage.get("userlist");
                let data = [];
                let pd = await $input.confirm({
                    title: "确认框",
                    message: "是否清除失效用户",
                    okBtn: "删除"
                })
                if (pd) {
                    for (var i=0; i<userlist.length; i++) { // forEach 不可用
                        let user = await nav(userlist[i].cookie);
                        if (user != false) {
                            data.push({
                                mid: user.mid,
                                name: user.uname,
                                face: user.face,
                                cookie: userlist[i].cookie,
                                is_login: userlist[i].is_login
                            })
                        }
                    }
                    $storage.put("userlist", data);
                    $ui.toast("清除成功");
                    this.refresh()
                } else {
                    $ui.toast("取消清除");
                }
            }
        })
        data.push({title: "用户列表 (单点切换、长按更多操作)",style: 'category'})
        userlist.forEach(m => {
            var daoqi = /\d{10}/g.exec(m.cookie)[0];
            data.push({
                style: 'simple',
                thumb: m.face,
                title: `用户名: ${m.name}`,
                summary: `用户MID: ${m.mid} ${formatUtcTime(daoqi*1000)}`,
                onClick: () => {
                    m.is_login = true;
                    $ui.toast("切换成功");
                    changLogin(m.mid);
                },
                onLongClick: async () => {
                    var selected = await $input.select({
                        title: '选择哪一个',
                        options: [
                            {title: '删除用户', fun: deleteLogin},
                            {title: '切换排序', fun: sorting},
                            {title: '显示配置', fun: showConfig},
                            {title: '属性', fun: attribute},
                        ]
                    })
                    selected != null ? selected.fun(m) : null;
                }
            })
        })
        return data;
    }
}