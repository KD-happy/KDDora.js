const login_log = require("../API/login_log");

module.exports = {
    type: 'list',
    title: '登录记录',
    async fetch() {
        var data = []
        await login_log(cookie).then(res => {
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
            .ip {
                padding-left: 10px;
            }
            </style>`
            res.data.data!=null && res.data.data.list.forEach(f => {
                content += `<span>${f.time_at}</span><span class="ip">${f.ip}</span><span class="right">${f.geo}</span><br>\n`
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