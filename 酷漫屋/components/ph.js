var all = [
    {title: '日阅读榜', id: 1},
    {title: '周阅读榜', id: 2},
    {title: '月阅读榜', id: 3},
    {title: '总阅读榜', id: 4},
    {title: '最近更新', id: 5},
    {title: '新漫上架', id: 6}
]

module.exports = {
    type: 'list',
    async fetch() {
        var data = all.map(m => {
            return {
                title: m.title,
                spanCount: 6,
                route: $route('rank', {
                    title: m.title,
                    id: m.id
                })
            }
        })
        return data;
    }
}