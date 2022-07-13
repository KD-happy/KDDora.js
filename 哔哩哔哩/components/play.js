const API = require("./API/API");
const api = API();

module.exports = {
    type: 'video',
    async fetch({args}) {
        getCookie()
        this._aid = this._aid == null ? args.aid : this._aid
        this._bvid = this._bvid == null ? args.bvid : this._bvid
        pages =  await api.view(cookie, this._aid, this._bvid).then(res => {
            res.data.data.pages.forEach(f => {
                f.title = f.part.substr(0, 10)
            })
            return res.data.code == 0 ? res.data.data.pages : []
        })
        this._cid = this._cid == null ? pages[0].cid : this._cid
        this.title = pages[0].part
        return await api.player_playurl(this._aid, this._bvid, this._cid, 16, "mp4", "html5").then(res => {
            if (pages.length == 1) {
                return {
                    url: res.data.data.durl[0].url
                }
            } else {
                return {
                    url: res.data.data.durl[0].url,
                    selectors: [
                        {
                            title: '选集',
                            select: 0,
                            onSelect: async (option) => {
                                this._cid = option.cid
                                this.title = option.part
                                $ui.toast(option.part)
                                api.player_playurl(this._aid, this._bvid, this._cid, 16, "mp4", "html5").then(res => {
                                    this.url = res.data.data.durl[0].url
                                })
                            },
                            options: pages
                        }
                    ]
                }
            }
        })
    }
}