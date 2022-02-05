const Refresh = require("./Refresh");

async function get(page) {
    var videos = $storage.get("videos");
    var returns = [];
    for (var i=(page-1)*20; i<page*20 && i<videos.length; i++) {
        returns.push(videos[i]);
    }
    return returns;
}

const all = [ // 总
    {"title": "全部", "url": "https://ddrk.me/"},
    {"title": "热映中", "url": "https://ddrk.me/category/airing/"},
    {"title": "站长推荐", "url": "https://ddrk.me/tag/recommend/"},
    {"title": "新番", "url": "https://ddrk.me/category/anime/new-bangumi/"}
]
const drama = [ // 剧集
    {"title": "欧美剧", "url": "https://ddrk.me/category/drama/western-drama/"},
    {"title": "日剧", "url": "https://ddrk.me/category/drama/jp-drama/"},
    {"title": "韩剧", "url": "https://ddrk.me/category/drama/kr-drama/"},
    {"title": "华语剧", "url": "https://ddrk.me/category/drama/cn-drama/"},
    {"title": "其他地区", "url": "https://ddrk.me/category/drama/other/"}
]
const movie = [ // 电影
    {"title": "全部", "url": "https://ddrk.me/category/movie/"},
    {"title": "欧美电影", "url": "https://ddrk.me/category/movie/western-movie/"},
    {"title": "日韩电影", "url": "https://ddrk.me/category/movie/asian-movie/"},
    {"title": "华语电影", "url": "https://ddrk.me/category/movie/chinese-movie/"},
    {"title": "豆瓣电影Top250", "url": "https://ddrk.me/tag/douban-top250/"},
]
const tags = [ // 类型
    {"title": "动画", "url": "https://ddrk.me/category/anime/"},
    {"title": "动作", "url": "https://ddrk.me/tag/action/"},
    {"title": "喜剧", "url": "https://ddrk.me/tag/comedy/"},
    {"title": "爱情", "url": "https://ddrk.me/tag/romance/"},
    {"title": "科幻", "url": "https://ddrk.me/tag/sci-fi/"},
    {"title": "罪犯", "url": "https://ddrk.me/tag/crime/"},
    {"title": "悬疑", "url": "https://ddrk.me/tag/mystery/"},
    {"title": "恐怖", "url": "https://ddrk.me/tag/horror/"},
    {"title": "纪录片", "url": "https://ddrk.me/category/documentary/"},
    {"title": "综艺", "url": "https://ddrk.me/category/variety/"},
]

module.exports = {
    title: '低端影视',
    type: 'drawer',
    searchRoute: $route('search'),
    actions: [
        {
            title: "刷新搜索",
            onClick: async () => {
                Refresh();
            }
        }
    ],
    items: [
        {
            title: '集合',
            route: $route('dd_topInfo', {
                arr: all
            })
        },
        {
            title: '剧集',
            route: $route('dd_topInfo', {
                arr: drama
            })
        },
        {
            title: '电影',
            route: $route('dd_topInfo', {
                arr: movie
            })
        },
        {
            title: '类型',
            route: $route('dd_topInfo', {
                arr: tags
            })
        }
    ]
}