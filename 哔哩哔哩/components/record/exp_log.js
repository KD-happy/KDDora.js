const exp_log = require("../API/exp_log");

module.exports = {
    type: 'list',
    title: '经验记录',
    async fetch() {
        var data = []
        await exp_log(cookie).then(res => {
            let content = `<style>
            * {
                font-size: 13px;
            }
            .red {
                color: red;
            }
            .green {
                color: green;
            }
            .right {
                padding-right: 10px;
                float: right;
            }
            .reason {
                padding-left: 10px;
            }
            </style>`
            res.data.data!=null && res.data.data.list.forEach(f => {
                content += `<span>${f.time}</span><span class="reason">${f.reason}</span><span class="right">${f.delta} 经验</span><br>\n`
            })
            data.push({
                title: '登录记录',
                style: 'richContent',
                content: {
                    html: content
                }
            })
        })
        return data
    },
    beforeCreate() {
        getCookie();
    }
}