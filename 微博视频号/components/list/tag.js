const API = require("../API");
var api = API(cookie);
var cursor = 0;

module.exports = {
    type: 'list',
    title: '微博视频号',
    actions: [
        {
            title: "切换排序",
            onClick: async () => {
                var options = [
                    { value: 0, title: '默认' },
                    { value: 1, title: '最热' }
                ]
                
                let selected = await $input.select({
                    title: `请选择 - 当前 ${options[tab_code].title}`,
                    options: options
                })
                if (selected != null) {
                    $storage.put("tab_code", selected.value)
                    $ui.toast("切换成功")
                    getCookie()
                }
            }
        }
    ],
    async beforeCreate() {
        getCookie()
        api = API(cookie)
    },
    async fetch({args, page}) {
        page = page || 0;
        this.title = args.title
        var data = []
        await api.getCollectionList(args.id, tab_code, cursor == -1 ? 0 : cursor).then(res => {
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
                    })
                })
            })
        }).catch(err => {
            $ui.alert("未知错误！！有可能是Cookie失效了")
        })
        if (cursor > 0) {
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