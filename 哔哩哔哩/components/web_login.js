const nav = require("./API/nav");

function hasId(mid) {
    var userlist = $storage.get("userlist");
    if (userlist.length > 0) {
        for (var i=0; i<userlist.length; i++) {
            if (userlist[i].mid == mid) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}

module.exports = {
    type: 'webview',
    title: '登录',
    uiOptions: {
        toolBar: true,
        statusBar: true
    },
    url: 'https://passport.bilibili.com/login',
    created() {
        this.actions = [
            {
                title: '获取Cookie',
                onClick: async () => {
                    if (this.cookies.SESSDATA != null) {
                        var myCookie = "SESSDATA=" + this.cookies.SESSDATA;
                        var user = await nav(myCookie);
                        if (user != false) {
                            if (hasId(user.mid)) {
                                $ui.toast("mid重复, 添加失败");
                            } else {
                                var userlist = $storage.get("userlist");
                                userlist.push({
                                    mid: user.mid,
                                    name: user.uname,
                                    face: user.face,
                                    cookie: myCookie,
                                    is_login: false
                                })
                                $storage.put("userlist", userlist);
                                $ui.toast("登录成功, 添加列表成功");
                            }
                        } else {
                            $ui.toast("添加失败, 未登录");
                        }
                    }
                }
            },
            {
                title: "清空Cookie",
                onClick: () => {
                    this.cookies = {};
                }
            }
        ]
    },
}