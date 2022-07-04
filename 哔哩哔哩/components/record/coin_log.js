const API = require("../API/API");
const api = API();

module.exports = {
    type: 'article',
    async fetch() {
        var content = null
        await api.coin_log(cookie).then(res => {
            content = `<style>
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
        })
        return {
            content: {
                html: content
            }
        }
    },
    beforeCreate() {
        getCookie();
    }
}