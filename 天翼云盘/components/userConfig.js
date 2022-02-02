const getUserBriefInfo = require("./API/getUserBriefInfo");
const getUserInfoForPortal = require("./API/getUserInfoForPortal");
const loginUrl = require("./API/loginUrl");

function hasId(userAccount) {
    var userlist = $storage.get("userlist");
    if (userlist.length > 0) {
        for (var i=0; i<userlist.length; i++) {
            if (userlist[i].userAccount == userAccount) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}

function changLogin(userAccount) {
    let userlist = $storage.get("userlist");
    userlist.forEach(f => {
        if (f.userAccount == userAccount) {
            f.is_login = true;
        } else {
            f.is_login = false
        }
    })
    $storage.put("userlist", userlist);
}

async function deleteLogin(m) {
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否删除用户: ${m.nickname}\n用户账号: ${m.userAccount}`,
        okBtn: "删除"
    })
    if (pd) {
        let userlist = $storage.get("userlist");
        let new_userlist = [];
        userlist.forEach(f => {
            if (f.userAccount != m.userAccount) {
                new_userlist.push(f);
            }
        })
        $storage.put("userlist", new_userlist);
        $ui.toast("删除成功")
    } else {
        $ui.toast("取消删除");
    }
}

async function showConfig(m) {
    $ui.showCode(JSON.stringify(m, null, ' '));
}

async function attribute(m) {
    $ui.showCode(`用户名: ${m.nickname}\n用户账号: ${m.userAccount}\nCookie: ${m.cookie}`);
}

async function sorting(m) {
    var userlist = $storage.get("userlist");
    var new_userlist = [], new_index=[], sort, sort_index;
    userlist.forEach((f, i) => {
        if (f.nickname != m.nickname)  {
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
    title: '用户配置',
    async fetch() {
        getCookie();
        var data = [];
        data.push({title: "当前用户",style: 'category'})
        if (cookie != "") {
            var info = await getUserBriefInfo(cookie);
            if (info != false) {
                data.push({
                    title: `用户名: ${info.nickname}`,
                    summary: `用户账号: ${info.userAccount}`,
                    thumb: info.icon
                })
                info = await getUserInfoForPortal(cookie);
                if (info != false) {
                    var available = info.available/1024/1024; // 剩余
                    var capacity = info.capacity/1024/1024; // 总量
                    data.push({
                        style: 'article',
                        title: "用户详细信息",
                        time: `${formateTimeStamp(new Date().getTime())}`,
                        summary: `已用空间: ${(capacity-available).toFixed(2)} M   =>   ${((capacity-available)/1024).toFixed(2)} G\n空闲空间: ${available.toFixed(2)} M   =>   ${(available/1024).toFixed(2)} G\n总量空间: ${capacity.toFixed(2)} M   =>   ${(capacity/1024).toFixed(2)} G`
                    })
                } else {
                    data.push({
                        style: 'article',
                        title: "当前IP不可刷新文件目录",
                        time: `${formateTimeStamp(new Date().getTime())}`,
                        summary: "可点击 “清除失效用户” 刷新Cookie 或 点击上方用户"
                    })
                }
            } else {
                data.push({
                    style: 'article',
                    title: "Cookie已失效",
                    time: `${formateTimeStamp(new Date().getTime())}`,
                    summary: "请 “清除失效用户”"
                })
            }
        } else {
            data.push({title: "用户名: ",summary: "用户账号: ",thumb: ""})
        }
        data.push({title: "登录操作",style: 'category'})
        data.push({
            title: "登录",
            spanCount: 4,
            route: $route("web_login")
        })
        data.push({ // 添加SSON
            title: "添加SSON",
            spanCount: 4,
            onClick: async () => {
                var mySSON = await $input.text({
                    title: "添加SSON",
                    hint: "请输入SSON",
                    value: ""
                })
                if (mySSON != null) {
                    if (mySSON.includes("SSON") == false) {
                        mySSON = "SSON=" + mySSON;
                    }
                    var LOGIN_USER = await loginUrl(mySSON);
                    if (LOGIN_USER != "") {
                        var myCookie = "COOKIE_LOGIN_USER="+LOGIN_USER;
                        var user = await getUserBriefInfo(myCookie);
                        if (user != false) {
                            if (hasId(user.userAccount)) {
                                var userlist = $storage.get("userlist");
                                var new_userlist = [];
                                userlist.forEach(f => {
                                    if (f.userAccount != user.userAccount) {
                                        new_userlist.push(f);
                                    } else {
                                        new_userlist.push({
                                            userAccount: user.userAccount,
                                            nickname: user.nickname,
                                            icon: user.icon,
                                            cookie: myCookie,
                                            sson: mySSON,
                                            is_login: f.is_login
                                        })
                                    }
                                })
                                $storage.put("userlist", new_userlist);
                                $ui.toast("为已有用户添加SSON成功");
                            } else {
                                var userlist = $storage.get("userlist");
                                userlist.push({
                                    userAccount: user.userAccount,
                                    nickname: user.nickname,
                                    icon: user.icon,
                                    cookie: myCookie,
                                    sson: mySSON,
                                    is_login: false
                                })
                                $storage.put("userlist", userlist);
                                $ui.toast("添加成功");;
                            }
                        } else {
                            $ui.toast("SSON已失效");
                        }
                    } else {
                        $ui.toast("SSON已失效");
                    }
                } else {
                    $ui.toast("取消添加");
                }
            }
        })
        data.push({ // 添加Cookie
            title: "添加Cookie",
            spanCount: 4,
            onClick: async () => {
                var myCookie = await $input.text({
                    title: "添加Cookie",
                    hint: "添加Cookie",
                    value: ""
                })
                if (myCookie != null) {
                    if (myCookie.includes("COOKIE_LOGIN_USER") == false) {
                        myCookie = "COOKIE_LOGIN_USER=" + myCookie;
                    }
                    var user = await getUserBriefInfo(myCookie);
                    if (user != false) {
                        if (hasId(user.userAccount)) {
                            $ui.toast("账户重复, 添加失败");
                        } else {
                            var userlist = $storage.get("userlist");
                            userlist.push({
                                userAccount: user.userAccount,
                                nickname: user.nickname,
                                icon: user.icon,
                                cookie: myCookie,
                                sson: "",
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
        data.push({title: "其他操作",style: 'category'})
        data.push({
            title: "回收站",
            spanCount: 3,
            route: $route("binFiles")
        })
        data.push({
            title: "登录日志",
            spanCount: 3,
            route: $route("loginLog")
        })
        data.push({
            title: "文件分享",
            spanCount: 3,
            route: $route("list_share")
        })
        data.push({
            title: "文件排序",
            spanCount: 3,
            onClick: async () => {
                getOrderBy();
                var order_title = "文件名 - AZ";
                var options = [], type = [
                    {title: '文件名 - AZ', orderBy: 'filename', descending: false},
                    {title: '文件名 - ZA', orderBy: 'filename', descending: true},
                    {title: '文件大小 - 小大', orderBy: 'filesize', descending: false},
                    {title: '文件大小 - 大小', orderBy: 'filesize', descending: true},
                    {title: '修改时间 - 晚早', orderBy: 'lastOpTime', descending: false},
                    {title: '修改时间 - 早晚', orderBy: 'lastOpTime', descending: true},
                ];
                type.forEach(f => {
                    if (f.orderBy!=orderBy || f.descending!=descending) {
                        options.push(f);
                    } else {
                        order_title = f.title;
                    }
                })
                var selected = await $input.select({
                    title: `当前排序: ${order_title}`,
                    options: options
                })
                selected!=null ? ($storage.put("orderBy", selected.orderBy) & $storage.put("descending", selected.descending) & $ui.toast("设置成功")) : $ui.toast("取消设置");
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
                        let user = await getUserBriefInfo(userlist[i].cookie);
                        let LOGIN_USER = await loginUrl(userlist[i].sson);
                        if (user != false) {
                            data.push({
                                userAccount: user.userAccount,
                                nickname: user.nickname,
                                icon: user.icon,
                                cookie: LOGIN_USER != "" ? "COOKIE_LOGIN_USER="+LOGIN_USER : userlist[i].cookie,
                                sson: userlist[i].sson != "" ? userlist[i].sson : "",
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
        $storage.get("userlist").forEach(m => {
            data.push({
                style: 'simple',
                title: `用户名: ${m.nickname}`,
                summary: `用户账号: ${m.userAccount}`,
                thumb: m.icon,
                onClick: () => {
                    m.is_login = true;
                    $ui.toast("切换成功");
                    changLogin(m.userAccount);
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