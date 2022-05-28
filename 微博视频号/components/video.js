const API = require("./API");
var api = API(cookie);

module.exports = {
    type: 'video',
    async beforeCreate() {
        getCookie()
        api = API(cookie)
    },
    async fetch({args, page}) {
        var options = []
        await api.getVideoByURL(args.oid).then(res => {
            var info = res.data.data.Component_Play_Playinfo
            for (key in info.urls) {
                options.push({
                    title: key,
                    url: `https:${info.urls[key]}`
                })
            }
        }).catch(err => {
            $ui.alert("未知错误！！有可能是Cookie失效了")
        })
        this.url = options[0].url
        return {
            url: options[0].url,
            selectors: [
                {
                    title: "清晰度",
                    select: 0,
                    onSelect: async (option) => {
                        this.url = option.url
                    },
                    options: options
                }
            ]
        }
    }
}