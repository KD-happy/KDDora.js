const API = require("./API");
var api = API(cookie);

// 添加UID和用户信息
async function putUID(uid) {
    let pd = true
    let UID = $storage.get("UID")
    UID.forEach(f => {
        if (f.uid == uid) {
            pd = false
            $ui.toast(`${uid} 已存在`)
        }
    })
    if (pd) {
        await api.getInfoByUID(uid).then(async res => {
            var ip
            await api.getIPByUID(uid).then(res => {
                ip = res.data.data.ip_location
            }).catch(err => {
                $ui.alert("未知错误！！有可能是Cookie失效了")
            })
            UID.push({
                uid: uid,
                name: res.data.data.user.screen_name,
                avatar: res.data.data.user.avatar_hd,
                location: res.data.data.user.location,
                ip: ip
            })
            $storage.put("UID", UID)
            $ui.toast(`${uid} 添加成功`)
        }).catch(err => {
            $ui.alert("未知错误！！有可能是Cookie失效了")
        })
    }
}
// 删除用户
async function deleteLogin(f) {
    let UID = $storage.get("UID")
    let myUID = []
    UID.forEach(ff => {
        if (ff.uid != f.uid) {
            myUID.push(ff)
        }
    })
    $storage.put("UID", myUID)
    $ui.toast("删除成功")
}
// 复制UID
async function copyUID(f) {
    $clipboard.text = f.uid
    $ui.toast("复制成功")
}
// 显示属性
async function attribute(f) {
    $ui.showCode(JSON.stringify(f, null, 2));
}
// 切换排序
async function sorting(f) {
    var UID = $storage.get("UID");
    var new_userlist = [], new_index=[], sort, sort_index;
    UID.forEach((ff, i) => {
        if (ff.uid != f.uid)  {
            new_userlist.push(ff);
            new_index.push({
                title: `切换到第 ${i+1}`,
                value: i
            });
        } else {
            sort = ff;
            sort_index = i;
        }
    })
    var selected = await $input.select({
        title: `当前排序为第 ${sort_index+1}`,
        options: new_index
    })
    if (selected != null) {
        new_userlist.splice(selected.value, 0, sort);
        $storage.put("UID", new_userlist);
        $ui.toast("切换成功");
    } else {
        $ui.toast("取消切换");
    }
}
// 更新用户信息
async function update() {
    UID.forEach(async (f, i, arr) => {
        await api.getInfoByUID(f.uid).then(async res => {
            arr[i] = {
                uid: f.uid,
                name: res.data.data.user.screen_name,
                avatar: res.data.data.user.avatar_hd,
                location: res.data.data.user.location
            }
            await api.getIPByUID(f.uid).then(res => {
                arr[i].ip = res.data.data.ip_location
            }).catch(err => {
                $ui.alert("未知错误！！有可能是Cookie失效了")
            })
        }).catch(err => {
            $ui.alert("未知错误！！有可能是Cookie失效了")
        })
        $storage.put("UID", UID)
        $ui.toast("更新成功")
    })
}
// 批量复制
async function copyAll() {
    var uidAll = []
    this.UID.forEach(f => {
        uidAll.push(f.uid)
    })
    $clipboard.text = uidAll.toString()
    $ui.toast("复制成功")
}
// 批量添加
async function insertAll() {
    let uidAll = await $input.text({
        title: '请输入批量UID',
        hint: 'UID',
        value: ''
    })
    uidAll = uidAll.split(',')
    uidAll.forEach(f => {
        putUID(f)
    })
}

module.exports = {
    type: 'list',
    title: '微博视频号 - 配置',
    beforeCreate() {
        getCookie()
        api = API(cookie)
    },
    async fetch() {
        var data = []
        data.push({
            style: 'article',
            title: "设置展示",
            time: `${formateTimeStamp(new Date().getTime())}`,
            summary: `视频展示：${$storage.get("top") ? "顶部显示" : "list显示"}     视频排序：${$storage.get("tab_code") == 0 ? "默认排序" : "热门排序"}\n首页样式：${$storage.get('style') ? "总体版": "名称版"}      当前用户列表数：${$storage.get("UID").length}人\n注意：顶部显示后视频排序就设置不了了，切换成list才能显示。视频排序只对分类视频有效。`
        });
        data.push({title: "Cookie操作",style: 'category'})
        data.push({
            title: "添加Cookie",
            spanCount: 4,
            onClick: async () => {
                let cookie = await $input.text({
                    title: '请输入微博Cookie',
                    hint: 'SUB',
                    value: ''
                })
                if (cookie.indexOf("SUB") > -1) {
                    $storage.put("cookie", cookie)
                } else {
                    $storage.put("cookie", `SUB=${cookie}`)
                }
                $ui.toast("添加成功")
            }
        })
        data.push({
            title: "删除Cookie",
            spanCount: 4,
            onClick: async () => {
                let pd = await $input.confirm({
                    title: "确认框",
                    message: "是否清除当前Cookie",
                    okBtn: "删除"
                })
                if (pd) {
                    $storage.put("cookie", "")
                    $ui.toast("删除成功")
                    getCookie()
                } else {
                    $ui.toast("取消删除")
                }
            }
        })
        data.push({
            title: "复制Cookie",
            spanCount: 4,
            onClick: async () => {
                $clipboard.text = $storage.get("cookie")
                $ui.toast("复制成功")
            }
        })
        data.push({
            title: "游客登录",
            spanCount: 4,
            onClick: async () => {
                $router.to($route('web'))
            }
        })
        data.push({title: "UID操作",style: 'category'})
        data.push({
            title: "添加用户UID",
            spanCount: 4,
            onClick: async () => {
                let uid = await $input.number({
                    title: '请输入要添加用户的UID',
                    hint: 'UID',
                    value: ''
                })
                if (uid != undefined) {
                    putUID(uid)
                } else {
                    $ui.toast("取消添加")
                }
            }
        })
        data.push({
            title: "删除所有UID",
            spanCount: 4,
            onClick: async () => {
                let pd = await $input.confirm({
                    title: "确认框",
                    message: "是否清除所有用户的UID",
                    okBtn: "删除"
                })
                if (pd) {
                    $storage.put("UID", [])
                    $ui.toast("删除成功")
                    getCookie()
                } else {
                    $ui.toast("取消删除")
                }
            }
        })
        data.push({
            title: "更新用户信息",
            spanCount: 4,
            onClick: async () => {
                await update()
            }
        })
        data.push({
            title: "批量复制",
            spanCount: 4,
            onClick: async () => {
                await copyAll()
            }
        })
        data.push({
            title: "批量添加",
            spanCount: 4,
            onClick: async () => {
                await insertAll()
            }
        })
        data.push({title: "用户列表",style: 'category'})
        $storage.get("UID").forEach(f => {
            data.push({
                style: 'simple',
                title: f.name,
                summary: `${f.ip} || ${f.location}`,
                thumb: f.avatar,
                onLongClick: async () => {
                    var selected = await $input.select({
                        title: '选择哪一个',
                        options: [
                            {title: '删除用户', fun: deleteLogin},
                            {title: '切换排序', fun: sorting},
                            {title: '复制UID', fun: copyUID},
                            {title: '属性', fun: attribute}
                        ]
                    })
                    selected != null ? selected.fun(f) : null;
                },
                onClick: async () => {
                    $router.to($route('list/onelist', f))
                }
            })
        })
        return data
    }
}