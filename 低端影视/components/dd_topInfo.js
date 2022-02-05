module.exports = {
    title: '低端影视',
    type: 'list',
    async fetch({args}) {
        var arr = args.arr;
        return arr.map(m => {
            return {
                title: m.title,
                route: $route('dd_videoShow', {
                    title: m.title,
                    url: m.url
                })
            }
        })
    }
}