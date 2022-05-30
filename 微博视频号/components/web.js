module.exports = {
    type: 'webview',
    url: 'https://weibo.com/login.php',
    async fetch() {
        $ui.toast("请点击上方的获取Cookie")
    },
    created() {
        this.actions = [
            {
                title: '获取Cookie',
                onClick: async () => {
                    if (this.cookies.SUB != null) {
                        var myCookie = "SUB=" + this.cookies.SUB;
                        $storage.put("cookie", myCookie)
                        $ui.toast("添加成功")
                    } else {
                        $ui.toast("添加失败")
                    }
                }
            }
        ]
    }
}