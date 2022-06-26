const folder_created_list_all = require("../API/folder_created_list_all");

module.exports = {
    type: 'topTab',
    title: '哔哩哔哩 - 收藏夹',
    beforeCreate() {
        getCookie();
    },
    async fetch({page}) {
        this.actions = [
            {
                title: '切换排序',
                onClick: async () => {
                    order = $storage.get('order');
                    var options = [], order_title, type = [
                        {title: '最近收藏', order: 'mtime'},
                        {title: '最多播放', order: 'view'},
                        {title: '最新投稿', order: 'pubtime'}
                    ];
                    type.forEach(f => {
                        if (f.order == order) {
                            order_title = f.title;
                        } else {
                            options.push(f);
                        }
                    })
                    var selected = await $input.select({
                        title: `当前排序: ${order_title}`,
                        options: options
                    })
                    selected!=null ? ($storage.put("order", selected.order) & $ui.toast("设置成功")) : $ui.toast("取消设置");
                }
            },
            {
                title: '切换样式',
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
        ]
        page = page || 1;
        var list = await folder_created_list_all(mid, cookie);
        if (list != false) {
            var data = list.map(m => {
                return {
                    title: m.title,
                    route: $route('list/Folder', {
                        id: m.id
                    })
                }
            })
            return data;
        }
    }
}