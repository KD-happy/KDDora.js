if (typeof $dora == 'undefined') {
    console.error('This project runs only in Dora.js.')
    console.error('Please visit https://dorajs.com/ for more information.')
    process.exit(-1)
}

console.info('Congratulation, your addon runs successfully!')

module.exports = {
    async getCookie() {
        var userlist = $storage.get("userlist");
        var go = true, cookie = "", sson = "";
        if (userlist == null) {
            userlist = [];
            $storage.put("userlist", userlist);
        }
        if (userlist.length > 0) {
            userlist.forEach(f => {
                if (f.is_login) {
                    go = false;
                    cookie = f.cookie;
                    sson = f.sson;
                }
            });
            if (userlist.length >= 0 && go) {
                userlist[0].is_login = true;
                cookie = userlist[0].cookie;
                sson = userlist[0].sson;
                $storage.put("userlist", userlist);
            }
        }
        this.cookie = cookie;
        this.sson = sson;
    },
    cookie: "",
    sson: "",
    taskInfos: "", // 复制用的
    parentId: -11,
    formateTimeStamp(time) {
        var date = new Date();
        date.setTime(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
}