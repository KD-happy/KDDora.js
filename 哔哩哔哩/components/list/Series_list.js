const popular_series_list = require("../API/popular_series_list");

module.exports = {
    type: 'list',
    title: '哔哩哔哩 - 每周必看',
    async fetch() {
        var list = await popular_series_list();
        return list.map(m => {
            return {
                title: m.subject,
                summary: m.name,
                spanCount: 6,
                route: $route('list/Series_one', {
                    number: m.number
                })
            }
        })
    }
}