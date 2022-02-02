const axios = require("axios");

module.exports = popular_series_one;

/**
 * 获取指定一期
 * @param {Number} number 哪一期
 * @returns 
 */
async function popular_series_one(number) {
    var url = `https://api.bilibili.com/x/web-interface/popular/series/one?number=${number}`;
    var res = await axios.get(url);
    return res.data.data.list;
}