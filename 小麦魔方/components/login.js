const config = require("./API/config");
const policies = require("./API/policies");
const policy = require("./API/policy");
const session = require("./API/session");
const storage = require("./API/storage");
const tag_delete = require("./API/tag_delete");
const tag_filter = require("./API/tag_filter");

var userlist;

async function login() {
    var userName = await $input.text({
        title: '登录 - 电子邮箱',
        hint: '电子邮箱',
        value: ''
    })
    if (userName == null) {
        return false;
    }
    var Password = await $input.text({
        title: '登录 - 密码',
        hint: '密码',
        value: ''
    })
    if (Password != null) {
        var cookie = await session(userName, Password);
        if (cookie == false) {return false;}
        // return cookie.replace("cloudreve-session=", "").replace(";", "");
        return cookie.replace(";", "");
    } else {
        return false;
    }
}

function changLogin(id) {
    let userlist = $storage.get("userlist");
    userlist.forEach(f => {
        if (f.id == id) {
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
        message: `是否删除用户: ${m.nickname}\n用户邮箱: ${m.user_name}`,
        okBtn: "删除"
    })
    if (pd) {
        let userlist = $storage.get("userlist");
        let new_userlist = [];
        userlist.forEach(f => {
            if (f.id != m.id) {
                new_userlist.push(f);
            }
        })
        $storage.put("userlist", new_userlist);
    } else {
        $ui.toast("取消删除");
    }
}

function hasId(id) {
    var userlist = $storage.get("userlist");
    if (userlist.length > 0) {
        for (var i=0; i<userlist.length; i++) {
            if (userlist[i].id == id) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}

async function attribute(m) {
    $ui.showCode(`id: ${m.id}\n用户名: ${m.nickname}\n邮箱: ${m.user_name}\nCookie: ${m.cookie}`);
}

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

async function showConfig(m) { // 显示配置
    $ui.showCode(JSON.stringify(m, null, ' '));
}

async function sorting(m) { // 切换排序
    var userlist = $storage.get("userlist");
    var new_userlist = [], new_index=[], sort, sort_index;
    userlist.forEach((f, i) => {
        if (f.id != m.id)  {
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
    title: '小麦魔方登录',
    async fetch() {
        getCookie();
        userlist = $storage.get("userlist");
        var info = await config(cookie);
        var po = await policies(cookie);
        if (po != false) {
            var po_current = po.current;
            var po_options = po.options;
        } else {
            var po_current = {id: "获取失败"};
            var po_options = [];
        }
        var data = [];
        data.push({
            title: "当前用户",
            style: 'category'
        });
        data.push({
            style: 'simple',
            thumb: `https://mo.own-cloud.cn/api/v3/user/avatar/${info.id}/l`,
            title: `用户名：${info.nickname}`,
            summary: `邮箱: ${info.user_name}`
        });
        var use = await storage(cookie);
        if (use != false) {
            var used = (Number(use.data.used)/1024/1024).toFixed(2);
            var free = (Number(use.data.free)/1024/1024).toFixed(2);
            var total = (Number(use.data.total)/1024/1024).toFixed(2);
        } else {
            var used = 0;
            var free = 0;
            var total = 0;
        }
        data.push({
            style: 'article',
            title: "储存空间和储存策略",
            time: `${formatUtcTime(new Date().getTime())}`,
            summary: `已用空间: ${used} M => ${(used/1024).toFixed(2)} G\n空闲空间: ${free} M => ${(free/1024).toFixed(2)} G\n总量空间: ${total} M => ${(total/1024).toFixed(2)} G\n当前储存策略: ${po_current.name}`
        });
        data.push({
            title: "登录操作",
            style: 'category'
        });
        data.push({
            title: '登录',
            thumb: $assets("login.svg"),
            spanCount: 6,
            onClick: async () => {
                var cloudreve_session = await login();
                if (cloudreve_session == false) {
                    $ui.toast("登录失败");
                } else {
                    var user = await config(cloudreve_session);
                    if (hasId(user.id)) {
                        $ui.toast("id重复, 添加失败");
                    } else {
                        userlist.push({
                            id: user.id,
                            user_name: user.user_name,
                            nickname: user.nickname,
                            is_login: false,
                            cookie: cloudreve_session
                        })
                        $storage.put("userlist", userlist);
                        $ui.toast("登录成功, 添加列表成功");
                    }
                }
            }
        });
        data.push({
            title: '添加Cookie',
            thumb: $assets("setting.svg"),
            spanCount: 6,
            onClick: async () => {
                var moCookie = await $input.text({
                    title: "添加Cookie",
                    hint: "请输入Cookie",
                    value: ""
                })
                if (moCookie != null) {
                    if (moCookie.includes("cloudreve-session") == false) {
                        moCookie = "cloudreve-session=" + moCookie;
                    }
                    var user = await config(moCookie);
                    if (user.nickname != "") {
                        if (hasId(user.id)) {
                            $ui.toast("id重复, 添加失败");
                        } else {
                            userlist.push({
                                id: user.id,
                                user_name: user.user_name,
                                nickname: user.nickname,
                                is_login: false,
                                cookie: moCookie
                            })
                            $storage.put("userlist", userlist);
                            $ui.toast("Cookie添加成功, 添加列表成功");
                        }
                    } else {
                        $ui.toast("添加失败, Cookie失效");
                    }
                } else {
                    $ui.toast("取消添加");
                }
            }
        });
        data.push({
            title: '标签操作',
            style: 'category'
        });
        data.push({
            title: '创建标签',
            spanCount: 6,
            thumb: $assets("create_tag.svg"),
            onClick: async () => {
                var name = await $input.text({
                    title: "设置标签名",
                    hint: "标签名",
                    value: ""
                })
                if (name == null) {
                    $ui.toast("取消创建");
                    return;
                }
                var expression = await $input.text({
                    title: "文件匹配规则",
                    hint: "使用*作为通配符",
                    value: ""
                })
                if (expression != null) {
                    if(await tag_filter(name, expression, cookie)) {
                        $ui.toast("创建成功");
                    } else {
                        $ui.toast("创建失败");
                    }
                } else {
                    $ui.toast("取消创建");
                }
            }
        });
        data.push({
            title: '删除标签',
            spanCount: 6,
            thumb: $assets("delete_tag.svg"),
            onClick: async () => {
                var options = [];
                options = info.tags.map(m => {
                    return {
                        title: m.name,
                        id: m.id
                    }
                })
                var selected = await $input.select({
                    title: '选择哪一个',
                    options: options
                })
                if (selected != null) {
                    if (await tag_delete(selected.id, cookie)) {
                        $ui.toast(`${selected.title} 删除成功`);
                    } else {
                        $ui.toast(`${selected.title} 删除失败`);
                    }
                } else {
                    $ui.toast("取消删除");
                }
            }
        });
        data.push({
            title: "列表操作",
            style: 'category'
        });
        data.push({
            title: "删除所有用户",
            spanCount: 4,
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
        });
        data.push({
            title: "清除失效用户",
            spanCount: 4,
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
                        let user = await config(userlist[i].cookie);
                        if (user.nickname != "") {
                            data.push({
                                id: user.id,
                                user_name: user.user_name,
                                nickname: user.nickname,
                                is_login: userlist[i].is_login,
                                cookie: userlist[i].cookie
                            })
                        }
                    }
                    $storage.put("userlist", data);
                    $ui.toast("清除成功");
                } else {
                    $ui.toast("取消清除");
                }
            }
        });
        data.push({
            title: "切换存储策略",
            spanCount: 4,
            onClick: async () => {
                var options = [];
                po_options.forEach(m => {
                    if (po_current.id != m.id) {
                        options.push({
                            title: m.name,
                            id: m.id
                        })
                    }
                })
                var selected = await $input.select({
                    title: '选择哪一个',
                    options: options
                })
                if (selected == null) {
                    $ui.toast("取消切换");
                } else {
                    if(await policy(selected.id, cookie)) {
                        $ui.toast("切换成功");
                    } else {
                        $ui.toast("切换失败");
                    }
                }
            }
        });
        data.push({
            title: '用户列表 (单点切换、长按更多操作)',
            style: 'category'
        });
        userlist.forEach(m => {
            data.push({
                style: 'simple',
                thumb: `https://mo.own-cloud.cn/api/v3/user/avatar/${m.id}/l`,
                title: `用户名：${m.nickname}`,
                summary: `邮箱: ${m.user_name}`,
                onClick: () => {
                    m.is_login = true;
                    $ui.toast("切换成功");
                    changLogin(m.id);
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
            });
        })
        return data;
    }
}