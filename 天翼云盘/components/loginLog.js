const API = require("./API/API");
const api = API();

module.exports = {
    type: 'list',
    title: '登录日志',
    async fetch({page}) {
        getCookie();
        page = page || 1;
        var list = await api.getLoginLog(page, sson);
        if (list != false) {
            var data = list.detail.map(m => {
                return {
                    title: `${m.appKey} -- ${m.loginArea}`,
                    summary: `${m.loginTime} -- ${m.deviceType} - ${m.operateSystem} -- ${m.userIp}`
                }
            })
            if (data.length < 50) {
                return data;
            } else {
                return {
                    nextPage: page+1,
                    items: data
                }
            }
        } else {
            $ui.toast("请添加SSON！");
        }
    }
}