var all = [
    {title: '冒险热血', id: 1},
    {title: '武侠格斗', id: 2},
    {title: '科幻魔幻', id: 3},
    {title: '侦探推理', id: 4},
    {title: '耽美爱情', id: 5},
    {title: '生活漫画', id: 6},
    {title: '推荐漫画', id: 11},
    {title: '完结', id: 12},
    {title: '连载', id: 13},
]

module.exports = {
    type: 'list',
    async fetch() {
        var data = all.map(m => {
            return {
                title: m.title,
                spanCount: 6,
                route: $route('sort', {
                    title: m.title,
                    id: m.id
                })
            }
        })
        return data;
    }
}