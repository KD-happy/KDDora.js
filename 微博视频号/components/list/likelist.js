const API = require("../API");
var api = API(cookie);
var cursor = 0;

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

module.exports = {
    type: 'list',
    title: '微博视频号',
    beforeCreate() {
        getCookie()
        api = API(cookie)
    },
    async fetch({args, page}) {
        page = page || 0;
        this.title = `${args.name} - 点赞过的视频`
        var data = []
        await api.getLikeList(args.uid, cursor == -1 ? 0 : cursor).then(res => {
            cursor = res.data.data.next_cursor
            res.data.data.list.forEach(f => {
                data.push({
                    style: 'live',
                    author: {
                        name: f.user.screen_name,
                        avatar: f.user.avatar_hd
                    },
                    title: f.page_info.media_info.kol_title,
                    thumb: f.page_info.page_pic,
                    viewerCount: f.page_info.media_info.online_users_number,
                    label: formateTimeStamp(new Date(f.created_at).getTime()),
                    route: $route('video', {
                        oid: f.page_info.object_id
                    }),
                    onLongClick: async () => {
                        let pd = await $input.confirm({
                            title: "添加用户",
                            message: "是否添加当前长按的用户",
                            okBtn: '确定'
                        })
                        if (pd) {
                            putUID(f.user.idstr)
                        } else {
                            $ui.toast("取消添加")
                        }
                    }
                })
            })
        }).catch(err => {
            $ui.alert("未知错误！！有可能是Cookie失效了")
        })
        if (cursor != -1) {
            return {
                nextPage: page + 1,
                items: data
            }
        } else {
            $ui.toast("加载完毕")
            return data
        }
    }
}