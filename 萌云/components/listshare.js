const API = require("./API/API");
const api = API();

var key;

async function file_down(m) { // 文件下载
    var url = await api.share_download(m.key, cookie);
    if (url != false) {
        $ui.browser(url);
        $ui.toast("开始下载...");
    } else {
        $ui.toast("获取失败");
    }
}

async function copySourceUrl(m) { // 复制分享链接和密码
    var url = `https://moecloud.cn/s/${key}?path=${m.path}/${m.name}`;
    $clipboard.text = url;
    $ui.toast("复制链接成功");
}

async function file_info(m) {
    $ui.showCode(`文件名: ${m.name}\n文件大小: ${(m.size/1024/1024).toFixed(2)}M\n创建时间: ${m.date}\n文件路径: ${m.path}`);
}

async function dir_info(m) {
    $ui.showCode(`文件夹名: ${m.name}\n创建时间: ${m.date}\n文件路径: ${m.path}`);
}

async function save_to(m) {
    if(await api.share_save(key, '/', cookie)) {
        $ui.toast("保存成功！");
    } else {
        $ui.toast("保存失败！");
    }
}

module.exports = {
    type: 'list',
    beforeCreate() {
        getCookie();
    },
    async fetch({args}) {
        this.title = args.title;
        key = args.key;
        var list = await api.share_list(args.key, args.path, cookie);
        if (list != false) {
            var dir = [];
            list.forEach(m => {
                if (m.type == "dir") {
                    m.path.substring(m.path.length-1) == "/" ? m.path = m.path.substring(0, m.path.length-1) : null;
                    dir.push({
                        title: m.name,
                        route: $route("listshare", {
                            title: m.name,
                            key: args.key,
                            path: m.path + '/' + m.name,
                        }),
                        onLongClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '保存', fun: save_to},
                                    {title: '复制链接', fun: copySourceUrl},
                                    {title: '属性', fun: dir_info}
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    });
                }
            });
            if (dir.length > 0) {
                dir.splice(0, 0, {
                    title: '文件夹 (单点打开)',
                    style: 'category'
                })
            }
            var file = [];
            list.map(m => {
                if (m.type == "file") {
                    file.push({
                        title: m.name,
                        onClick: () => {
                            file_down(m);
                        },
                        onLongClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '保存', fun: save_to},
                                    // {title: '复制链接', fun: copySourceUrl},
                                    {title: '属性', fun: file_info}
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    });
                }
            });
            if (file.length > 0) {
                file.splice(0, 0, {
                    title: '文件 (单点下载)',
                    style: 'category'
                })
            }
            file.forEach(f => {
                dir.push(f);
            })
            return dir;
        }
    }
}