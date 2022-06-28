const coin_log = require("../API/coin_log");

module.exports = {
    type: 'list',
    title: '硬币记录',
    async fetch() {
        var data = []
        await coin_log(cookie).then(res => {
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
                content += `<span>${f.time}</span><span class="reason">${f.reason}</span><span class="right ${f.delta>0 ? "green" : "red"}">${f.delta>0 ? `+${f.delta}` : f.delta} 硬币</span><br>\n`
            })
            data.push({
                title: '硬币记录',
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