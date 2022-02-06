module.exports = {
    type: 'list',
    title: '分类列表',
    async fetch() {
        var data = [];
        data.push({
            style: 'category',
            title: '添加关注',
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
                    })
                })
            })
        }
        return data;
    }
}