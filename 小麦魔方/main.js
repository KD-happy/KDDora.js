if (typeof $dora == 'undefined') {
    console.error('This project runs only in Dora.js.')
    console.error('Please visit https://dorajs.com/ for more information.')
    process.exit(-1)
}

console.info('Congratulation, your addon runs successfully!')

module.exports = {
    async getCookie() {
        var userlist = $storage.get("userlist");
        var go=true, cookie="";
        if (userlist == null) {
            userlist = [];
            $storage.put("userlist", userlist);
        }
        if (userlist.length > 0) {
            userlist.forEach(f => {
                if (f.is_login) {
                    go = false;
                    cookie = f.cookie;
                }
            });
            if (userlist.length >= 0 && go) {
                userlist[0].is_login = true;
                cookie = userlist[0].cookie;
                $storage.put("userlist", userlist);
            }
        }
        this.cookie = cookie;
    },
    cookie: "",
    path: '',
    src_dir: '', // 源路径
    mid: '', // 文件id
    isFile: true
}