const axios = require("axios");

module.exports = video_info_by_ac;

async function video_info_by_ac(ac) {
    var url = `https://www.acfun.cn/${ac}`;
    var headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
    }
    var res = await axios.get(url, {
        headers: headers
    })
    return /videoInfo = ?(.*});\n +window.videoResource/.exec(res.data)[1];
}