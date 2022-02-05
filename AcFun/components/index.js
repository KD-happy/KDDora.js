const video_info_by_ac = require("./video_info_by_ac")

module.exports = {
    type: 'list',
    async fetch() {
        return [
            {
                style: 'simple',
                title: '宅舞',
                route: $route("tags_list", {
                    tag: 'list134'
                })
            },
            {
                style: 'simple',
                title: '咬人猫',
                route: $route("up_list", {
                    up: '413684'
                })
            }
        ]
    }
}
