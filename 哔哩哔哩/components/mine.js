const nav = require("./API/nav");
const calendar_event = require("./API/calendar_event");
const exp_reward = require("./API/exp_reward");
const vip_privilege = require("./API/vip_privilege");
const nav_stat = require("./API/nav_stat");

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
            f.is_login = false
        }
    })
    $storage.put("userlist", userlist);
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
    } else {
        $ui.toast("取消删除");
    }
}

async function showConfig(m) { // 显示配置
    $ui.showCode(JSON.stringify(m, null, ' '));
}

async function attribute(m) { // 属性
    $ui.showCode(`用户MID: ${m.mid}\n用户名: ${m.name}\nCookie: ${m.cookie}`);
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
    } else {
        $ui.toast("取消切换");
    }
}

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 个人信息和配置',
    async fetch() {
        getCookie();
        var userlist = $storage.get("userlist");
        var info = await nav(cookie);
        var info1 = await nav_stat(cookie);
        var info2 = await calendar_event(cookie);
        var info3 = await exp_reward(cookie);
        var info4 = await vip_privilege(cookie);
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
                summary: `硬币: ${info.money}  B币: ${info.wallet.bcoin_balance}\nB币券: ${info4[0].state == 1 ? `已领取 - 剩余 ${info.wallet.coupon_balance}` : "未领取"}  优惠券: ${info4[1].state == 1 ? "已领取" : "未领取"}\n每日登录: ${info3.login ? "完成" : "未完成"},  每日观看: ${info3.watch ? "完成" : "未完成"}\n每日分享: ${info3.share ? "完成" : "未完成"},  投币次数: ${info3.coins/10}次`
            })
        } else {
            data.push({style: 'simple',thumb: "",title: "用户名: 游客", summary: "用户mid: 0"});
            data.push({style: 'article',title: "用户详细信息",time: `${formatUtcTime(new Date().getTime())}`,summary: "请登录"});
        }
        data.push({title: "登录操作",style: 'category'})
        data.push({
            title: "登录",
            spanCount: 6,
            route: $route("web_login")
        })
        data.push({
            title: "添加Cookie",
            spanCount: 6,
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
                    var user = await nav(myCookie);
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
                        }
                    } else {
                        $ui.toast("添加失败, Cookie失效");
                    }
                } else {
                    $ui.toast("取消添加");
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