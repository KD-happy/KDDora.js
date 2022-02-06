module.exports = {
    type: 'list',
    title: '分类列表',
    async fetch() {
        var data = [];
        data.push({
            style: 'category',
            title: '添加分类',
            action: {
                title: "添加",
                onClick: async () => {
                    var tag_name = await $input.text({
                        title: '添加分类',
                        hint: '名称',
                        value: ''
                    })
                    if (tag_name != null) {
                        var tag = await $input.text({
                            title: '添加分类',
                            hint: '分类',
                            value: ''
                        })
                        if (tag != null) {
                            var tags = $storage.get('tags');
                            tags == null ? ($storage.put('tag', []), tags=[]) : null;
                            tags.push({
                                tag_name: tag_name,
                                tag: tag
                            })
                            $storage.put('tags', tags);
                            $ui.toast('添加成功');
                        }
                    }
                }
            }
        })
        var tags = $storage.get('tags');
        if (tags != null) {
            tags.forEach(f => {
                data.push({
                    title: f.tag_name,
                    spanCount: 6,
                    route: $route("tags_list", {
                        tag: f.tag
                    })
                })
            })
        }
        return data;
    }
}