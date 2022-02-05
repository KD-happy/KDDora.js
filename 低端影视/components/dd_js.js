const axios = require("axios");
const CryptoJS = require("../assets/crypt");
const cheerio = require('cheerio');

async function getJson(url) {
    // var url = "https://ddrk.me/euphoria";
    var res = await axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    });
    var $ = cheerio.load(res.data);
    var json = $(".wp-playlist-script");
    // console.log(json.html())
    json = json.html().toString();
    json = JSON.parse(json);
    var tracks = json.tracks;
    var tt = tracks.map(t => {
        return {
            title: t.caption,
            src: t.src0
        }
    })
    console.log(tt);
    return tt;
}

module.exports = {
    type: 'list',
    title: '低端影视',
    async fetch({args}) {
        this.title = args.title;
        // var url = "https://ddrk.me/euphoria";
        var json = await getJson(args.url);
        var data = json.map(m => {
            return {
                spanCount: 6,
                title: m.title,
                route: $route('dd_video', {
                    src: m.src,
                    title: m.title
                })
            }
        })
        return data;
    }
}