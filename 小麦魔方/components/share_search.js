const axios = require("axios");
const share_download = require("./API/share_download");
const share_info = require("./API/share_info");
const share_search = require("./API/share_search");
const share_save = require("./API/share_save");

var keywork, go;

async function file_down(m) { // 文件下载
    var url = await share_download(m.key, cookie);
    if (url != false) {
        $ui.browser(url);
        $ui.toast("开始下载...");
    } else {
        $ui.toast("获取失败");
    }
}

async function file_info(m) {
    var data = await share_info(m.key, cookie);
    if (data == false) {
        $ui.toast("获取失败！");
    } else {
        $ui.showCode(`文件名: ${data.source.name}\n文件大小: ${(data.source.size/1024/1024).toFixed(2)}M\n访问次数: ${data.views}\n下载次数: ${data.downloads}\n创建时间: ${data.create_date}\n储存节点: ${data.creator.group_name}`);
    }
}

async function dir_info(m) {
    var data = await share_info(m.key, cookie);
    if (data == false) {
        $ui.toast("获取失败！");
    } else {
        $ui.showCode(`文件夹名: ${data.source.name}\n访问次数: ${data.views}\n下载次数: ${data.downloads}\n创建时间: ${data.create_date}\n储存节点: ${data.creator.group_name}`);
    }
}

async function copySourceUrl(m) { // 复制分享链接和密码
    var url = `https://mo.own-cloud.cn/s/${m.key}?path=%2F`;
    $clipboard.text = url;
    $ui.toast("复制链接成功");
}

async function save_to(m) {
    if(await share_save(m.key, path=="" ? "/" : path, cookie)) {
        $ui.toast("保存成功！");
    } else {
        $ui.toast("保存失败！");
    }
}

module.exports = {
    type: 'list',
    async beforeCreate() {
        getCookie();
        go = true;
        keywork = await $input.text({
            title: '分享文件搜索',
            hint: '文件名',
            value: ''
        });
    },
    async fetch({page}) {
        page = page || 1;
        keywork == null ? this.finish() : null;
        var list = await share_search(keywork, page, cookie);
        if (list != false) {
            if (list.length < 18) {
                go = false;
            }
            var data = list.map(m => {
                if (m.is_dir) {
                    return {
                        title: `* ${m.source.name}`,
                        route: $route("listshare", {
                                title: m.source.name,
                                key: m.key,
                                path: '/'
                        }),
                        onLongClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '保存文件', fun: save_to},
                                    {title: '复制链接', fun: copySourceUrl},
                                    {title: '属性', fun: dir_info}
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                } else {
                    return {
                        title: m.source.name,
                        onClick: () => {
                            file_down(m);
                        },
                        onLongClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '保存文件', fun: save_to},
                                    {title: '复制链接', fun: copySourceUrl},
                                    {title: '属性', fun: file_info}
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                }
            });
        } else {
            $ui.toast("没有匹配文件！");
        }
        if (go) {
            return {
                nextPage: page+1,
                items: data
            }
        } else {
            return data;
        }
    }
}