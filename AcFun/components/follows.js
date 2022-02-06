module.exports = {
    type: 'list',
    title: '分类列表',
    async fetch() {
        var data = [];
        data.push({
            style: 'category',
            title: '添加关注 (单点打开、长按删除)',
            action: {
                title: "添加",
                onClick: async () => {
                    var follow_name = await $input.text({
                        title: '添加关注',
                        hint: '名称',
                        value: ''
                    })
                    if (follow_name != null) {
                        var follow = await $input.text({
                            title: '添加关注',
                            hint: '关注UID',
                            value: ''
                        })
                        if (follow != null) {
                            var follows = $storage.get('follows');
                            follows == null ? ($storage.put('follows', []), follows=[]) : null;
                            follows.push({
                                follow_name: follow_name,
                                follow: follow
                            })
                            $storage.put('follows', follows);
                            $ui.toast('添加成功');
                        }
                    }
                }
            }
        })
        var follows = $storage.get('follows');
        if (follows != null) {
            follows.forEach(f => {
                data.push({
                    title: f.follow_name,
                    spanCount: 6,
                    route: $route("up_list", {
                        up: f.follow
                    }),
                    onLongClick: async () => {
                        let pd = await $input.confirm({
                            title: "确认框",
                            message: `是否删除该标签: ${f.follow_name}`,
                            okBtn: "删除"
                        })
                        if (pd) {
                            let follows = $storage.get("follows");
                            let new_follows = [];
                            follows.forEach(m => {
                                if (f.follow != m.follow && f.follow_name != m.follow_name) {
                                    new_follows.push({
                                        follow_name: m.follow_name,
                                        follow: m.follow
                                    })
                                }
                            })
                            $storage.put('follows', new_follows);
                            $ui.toast("删除成功");
                        } else {
                            $ui.toast("取消删除");
                        }
                    }
                })
            })
        }
        return data;
    }
}