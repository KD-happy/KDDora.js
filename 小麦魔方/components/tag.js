const tags = require("./API/tags");
const preview = require("./API/preview");
const property = require("./API/property");
const share = require("./API/share");
const rename = require("./API/rename");
const download = require("./API/download");

// var cookie;

function formatUtcTime(v) { // 时间格式化
    if (!v) {
        return ''
    }
    let date = new Date(v);
    date = new Date(date.valueOf());
    return date.getFullYear() +
        "-" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
        "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        " " + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ":" + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
}

async function attribute(m) { // 属性
    var info = await property(m.id, false, cookie);
    $ui.showCode(`文件名: ${m.name}\n文件大小: ${(info.size/1024/1024).toFixed(2)}M\n创建时间: ${formatUtcTime(info.created_at)}\n更新时间: ${formatUtcTime(info.updated_at)}\n查询时间: ${formatUtcTime(info.query_date)}\n储存节点: ${info.policy}`);
}

async function make_share(m) { // 分享文件、分享文件夹
    var new_pwd = "";
    var char = 'abcdefghijklmnopqrstuvwxyz1234567890';
    for (var i = 0; i < 6; i++) {
        j = Math.floor(Math.random() * char.length);
        new_pwd += char.charAt(j);
    }
    $ui.toast("已随机生成密码, 可自行修改");
    var password = await $input.text({
        title: '输入分享密码',
        hint: "分享密码",
        value: new_pwd
    })
    if (password != null) {
        var data = await share(m.id, false, password, true, 0, cookie);
        $ui.toast("分享成功");
        $ui.showCode(`链接: ${data}\n密码: ${password}`);
    } else {
        $ui.toast("取消分享");
    }
}

async function file_rename(m) { // 重新命名文件
    var new_name = await $input.text({
        title: '修改文件名',
        hint: "新文件名",
        value: m.name
    })
    var data = await rename(m.id, true, new_name, cookie);
    if (data) {
        $ui.toast("重新命名成功！");
    } else {
        $ui.toast("重新命名失败！");
    }
}

async function file_down(m) { // 文件下载
    var url = await download(m.id, cookie);
    if (url != false) {
        $ui.browser(url);
        $ui.toast("开始下载...");
    } else {
        $ui.toast("获取失败");
    }
}

async function file_delete(m) { // 删除文件
    var data = await object_delete(m.id, true, cookie);
    if (data) {
        $ui.toast("删除文件成功！");
    } else {
        $ui.toast("删除文件失败！");
    }
}

module.exports = {
    type: 'list',
    beforeCreate() {
        getCookie();
    },
    async fetch({args}) {
        this.title = args.title;
        var list = await tags(args.tag, cookie);
        var file = [];
        if (list != false) {
            list.map(m => {
                if (m.type == "file") {
                    file.push({
                        title: m.name,
                        onClick: async () => {
                            var type = ['.flv', '.mp4', '.ts'];
                            var video = false;
                            type.forEach(f => {m.name.includes(f) ? video=true : null});
                            if (video) {
                                var url = await preview(m.id, cookie);
                                $router.to($route('@video', {url: url, title: m.name}));
                            } else {
                                $ui.toast("不是视频");
                            }
                        },
                        onLongClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '文件下载', fun: file_down},
                                    {title: '重新命名', fun: file_rename},
                                    {title: '分享文件', fun: make_share},
                                    {title: '删除文件', fun: file_delete},
                                    {title: '属性', fun: attribute},
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    });
                }
            });
        }
        return file;
    }
}