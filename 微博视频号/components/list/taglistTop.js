const API = require("../API");
var api = API(cookie);

module.exports = {
    type: 'topTab',
    title: '微博视频号',
    actions: [
        {
            title: "切换样式",
            onClick: async () => {
                let pd = await $input.confirm({
                    title: "切换样式",
                    message: "当前样式显示在顶部，修改后是list点击",
                    okBtn: '确定'
                })
                if (pd) {
                    $storage.put("top", !top);
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
        this.title = `${args.name} - 标签视频`
        var data = []
        await api.getVideoTab(args.uid).then(res => {
            res.data.data.playlists.forEach(f => {
                data.push({
                    title: f.name,
                    route: $route('list/tag', {
                        id: f.id_str,
                        title: f.name
                    })
                })
            })
        }).catch(err => {
            $ui.alert("未知错误！！有可能是Cookie失效了")
        })
        return data
    }
}