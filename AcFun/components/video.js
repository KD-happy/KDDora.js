const video_info_by_ac = require("./video_info_by_ac");

module.exports = {
    type: 'video',
    async fetch({args}) {
        var vido_info = await video_info_by_ac(args.ac);
        vido_info = JSON.parse(vido_info);
        this.title = vido_info.title;
        var ksPlayJson = JSON.parse(vido_info.currentVideoInfo.ksPlayJson);
        var transcodeInfos = vido_info.currentVideoInfo.transcodeInfos
        var options = ksPlayJson.adaptationSet[0].representation.map((m, i) => {
            return {
                title: transcodeInfos[i].qualityType,
                url: m.url,
            }
        })
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