const axios = require("axios");
const CryptoJS = require("../assets/crypt");

async function getVideoUrl(vtracksrc0) {
    var eTimes = Date.parse(new Date()) + 600000;
    var uTxt = CryptoJS.enc.Utf8.parse("{\"path\":\"" + vtracksrc0 + "\",\"expire\":" + eTimes.toString() + "}");
    var uKey = CryptoJS.enc.Utf8.parse("zevS%th@*8YWUm%K");
    var waiv = CryptoJS.enc.Utf8.parse("5080305495198718");
    var ttestvtrack = CryptoJS.AES.encrypt(uTxt,uKey,{
        iv: waiv,
        mode: CryptoJS.mode.CBC
    });
    var vtracksrc = encodeURIComponent(ttestvtrack.ciphertext.toString(CryptoJS.enc.Base64));

    var url = `https://v3.ddrk.me:19443/video?id=${vtracksrc}&type=mix`;
    // var url = `https://v3.ddrk.me:19443/video`;
    var params = {
        'id': vtracksrc,
        'type': 'mix'
    }
    var res = await axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    })
    return res.data.url;
}

module.exports = {
    type: 'video',
    async fetch({args}) {
        this.title = args.title;
        this.url = await getVideoUrl(args.src);
    }
}