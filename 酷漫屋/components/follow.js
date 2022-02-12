module.exports = {
    type: 'list',
    title: '收藏',
    async fetch() {
        var follows = $storage.get('follows');
        if (follows == null) {
            $storage.put('follows', []);
        } else {
            var data = follows.map(m => {
                return {
                    style: 'vod',
                    title: m.title,
                    thumb: m.img,
                    id: m.id,
                    route: $route('read', {
                        url: m.url
                    }),
                    onLongClick: async () => {
                        let pd = await $input.confirm({
                            title: '是否删除',
                            message: `删除 ${m.title}`,
                            okBtn: '删除'
                        })
                        if (pd) {
                            var follows = $storage.get('follows');
                            var new_follows = [];
                            follows.forEach(f => {
                                if (m.id != f.id) {
                                    new_follows.push({
                                        id: f.id,
                                        title: f.title,
                                        img: f.img
                                    })
                                }
                            })
                            $storage.put('follows', new_follows);
                            $ui.toast("删除成功");
                        } else {
                            $ui.toast("取消删除");
                        }
                    }
                }
            })
            return data;
        }
    }
}