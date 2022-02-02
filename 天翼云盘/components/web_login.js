const axios = require("axios");

const getUserBriefInfo = require("./API/getUserBriefInfo");
const loginUrl = require("./API/loginUrl");

function hasId(userAccount) {
    var userlist = $storage.get("userlist");
    if (userlist.length > 0) {
        for (var i=0; i<userlist.length; i++) {
            if (userlist[i].userAccount == userAccount) {
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
    url: 'https://m.ctyun.cn/wap/main/auth/login',
    created() {
        this.actions = [
            {
                title: '获取Cookie',
                onClick: async () => {
                    if (this.cookies.SSON != null) {
                        mySSON = "SSON=" + this.cookies.SSON;
                        var LOGIN_USER = await loginUrl(mySSON);
                        if (LOGIN_USER != "") {
                            var myCookie = "COOKIE_LOGIN_USER="+LOGIN_USER;
                            var user = await getUserBriefInfo(myCookie);
                            if (user != false) {
                                if (hasId(user.userAccount)) {
                                    var userlist = $storage.get("userlist");
                                    var new_userlist = [];
                                    userlist.forEach(f => {
                                        if (f.userAccount != user.userAccount) {
                                            new_userlist.push(f);
                                        } else {
                                            new_userlist.push({
                                                userAccount: user.userAccount,
                                                nickname: user.nickname,
                                                icon: user.icon,
                                                cookie: myCookie,
                                                sson: mySSON,
                                                is_login: f.is_login
                                            })
                                        }
                                    })
                                    $storage.put("userlist", new_userlist);
                                    $ui.toast("为已有用户添加SSON成功");
                                } else {
                                    var userlist = $storage.get("userlist");
                                    userlist.push({
                                        userAccount: user.userAccount,
                                        nickname: user.nickname,
                                        icon: user.icon,
                                        cookie: myCookie,
                                        sson: mySSON,
                                        is_login: false
                                    })
                                    $storage.put("userlist", userlist);
                                    $ui.toast("添加成功");;
                                }
                            }
                        }
                    } else {
                        $ui.toast("获取SSON失败");
                    }
                    console.log(this.cookies);
                }
            },
            {
                title: "清空Cookie",
                onClick: () => {
                    this.url = "https://e.189.cn/logout.do";
                    $ui.toast("退出...");
                }
            }
        ]
    },
    async fetch() {
        var url = "https://e.189.cn/index.do";
        var res = await axios.get(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            }
        })
        this.url = /src="(.*)"><\/iframe>/g.exec(res.data)[1];
    }
}