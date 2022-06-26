if (typeof $dora == 'undefined') {
    console.error('This project runs only in Dora.js.')
    console.error('Please visit https://dorajs.com/ for more information.')
    process.exit(-1)
}

console.info('Congratulation, your addon runs successfully!')

module.exports = {
    async getCookie() {
        console.log('this.top',this.top)
        var userlist = $storage.get("userlist");
        var order = $storage.get("order");
        this.top = $storage.get("top") == undefined ? false && $storage.put("top", false) : $storage.get("top")
        if (order == null) {
            $storage.put("order", "mtime");
            this.order = "mtime";
        } else {
            this.order = order;
        }
        var go = true, cookie = "", mid = 0;
        if (userlist == null) {
            userlist = [];
            $storage.put("userlist", userlist);
        }
        if (userlist.length > 0) {
            userlist.forEach(f => {
                if (f.is_login) {
                    go = false;
                    cookie = f.cookie;
                    mid = f.mid;
                }
            });
            if (userlist.length >= 0 && go) {
                userlist[0].is_login = true;
                cookie = userlist[0].cookie;
                mid = userlist[0].mid;
                $storage.put("userlist", userlist);
            }
        }
        this.cookie = cookie;
        this.mid = mid;
    },
    top: false,
    cookie: "",
    mid: 0,
    order: '',
    formateTimeStamp(time) {
        var date = new Date();
        date.setTime(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours()< 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes()< 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds()< 10 ? "0" + date.getSeconds() : date.getSeconds();
        return year + "-" + month + "-" + day+" "+hour+":"+minute+":"+second;
    }
}