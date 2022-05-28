if (typeof $dora == 'undefined') {
    console.error('This project runs only in Dora.js.')
    console.error('Please visit https://dorajs.com/ for more information.')
    process.exit(-1)
}

console.info('Congratulation, your addon runs successfully!')

module.exports = {
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
    },
    async getCookie() {
        this.cookie = $storage.get("cookie") == undefined ? "" && $storage.put("cookie", "") : $storage.get("cookie")
        this.UID = $storage.get("UID") == undefined ? [] && $storage.put("UID", []) : $storage.get("UID")
        this.tab_code = $storage.get("tab_code") == undefined ? 0 && $storage.put("tab_code", 0) : $storage.get("tab_code")
        this.top = $storage.get("top") == undefined ? false && $storage.put("top", false) : $storage.get("top")
    },
    cookie: "",
    UID: [],
    tab_code: 0,
    top: false
}