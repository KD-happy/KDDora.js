const ranktype = [
    {title: '全站', rid: '0'},
    {title: '舞蹈', rid: '129'},
    {title: '游戏', rid: '4'},
    {title: '美食', rid: '211'},
    {title: '鬼畜', rid: '119'},
    {title: '科技', rid: '188'},
    {title: '动画', rid: '1'},
    {title: '音乐', rid: '3'},
    {title: '知识', rid: '36'},
]

module.exports = {
    type: 'topTab',
    title: '哔哩哔哩 - 排行',
    tabMode: 'scrollable',
    fetch() {
        return ranktype.map(m => {
            return {
                title: m.title,
                route: $route('list/Rank', {
                    rid: m.rid,
                    type: 'all'
                })
            }
        })
    }
}