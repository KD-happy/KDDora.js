const axios = require("axios");

module.exports = popular_series_list;

/**
 * 获取热门列表
 * @returns {Object}
 */
async function popular_series_list() {
    var url = 'https://api.bilibili.com/x/web-interface/popular/series/list';
    var res = await axios.get(url);
    return res.data.data.list;
}