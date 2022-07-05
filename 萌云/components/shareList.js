const API = require("./API/API");
const api = API();

var go;

async function shareList(page) { // 分享列表
    var list = await api.share_page(page, cookie);
    if (list != false) {
        if (list.total <= page*18) {
            go = false;
        }
        return list.items;
    } else {
        return false;
    }
}

async function attribute(m) { // 分享链接的属性
    if (m.is_dir) {
        var preview = m.preview ? "可以" : "不可以";
        $ui.showCode(`文件夹名: ${m.source.name}\n密码: ${m.password}\n可以预览: ${preview}\n下载次数: ${m.downloads}\n预览次数: ${m.views}\n创建时间: ${m.create_date}`);
    } else {
        var preview = m.preview ? "可以" : "不可以";
        $ui.showCode(`文件名: ${m.source.name}\n密码: ${m.password}\n文件大小: ${(m.source.size/1024/1024).toFixed(2)}M\n可以预览: ${preview}\n下载次数: ${m.downloads}\n预览次数: ${m.views}\n创建时间: ${m.create_date}`);
    }
}

async function copySourceUrl(m) { // 复制分享链接和密码
    if (m.password == "") {
        var url = `https://moecloud.cn/s/${m.key}`;
    } else {
        var url = `https://moecloud.cn/s/${m.key}?password=${m.password}`;
    }
    $clipboard.text = url;
    $ui.toast("复制链接成功");
}

async function sharePassword(m) { // 修改分享链接的密码
    var value = await $input.text({
        title: '修改分享密码',
        hint: "分享密码",
        value: m.password
    })
    if (value != null) {
        var data = await api.share_password(m.key, value, cookie);
        if (data) {
            $ui.toast("密码修改成功！");
        } else {
            $ui.toast("密码修改失败！");
        }
    } else {
        $ui.toast("取消密码修改");
    }
}

async function deletePassword(m) { // 删除分享链接的密码
    var data = await api.share_password(m.key, "", cookie);
    if (data) {
        $ui.toast("密码修改成功！");
    } else {
        $ui.toast("密码修改失败！");
    }
}

async function sharePreview(m) { // 修改分享链接的预览状态
    if (m.preview) {
        var data = await api.share_preview(m.key, 'false', cookie);
        if (data) {
            $ui.toast("禁止预览成功！");
        } else {
            $ui.toast("预览切换失败！");
        }
    } else {
        var data = await api.share_preview(m.key, 'true', cookie);
        if (data) {
            $ui.toast("设置预览成功！");
        } else {
            $ui.toast("预览切换失败！");
        }
    }
}

async function shareDelete(m) {
    var data = await api.share_delete(m.key, cookie);
    if (data) {
        $ui.toast("分享链接删除成功！");
    } else {
        $ui.toast("分享链接删除失败！");
    }
}

module.exports = {
    type: 'list',
    beforeCreate() {
        // cookie = `cloudreve-session=${$prefs.get("moCookie")}`;
        getCookie();
        go = true;
    },
    async fetch({page}) {
        page = page || 1;
        var list = await shareList(page);
        if (list != false) {
            var data = list.map(m => {
                if (m.is_dir) {
                    return {
                        title: `* ${m.source.name}`,
                        onClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '预览切换', fun: sharePreview},
                                    {title: '修改分享密码', fun: sharePassword},
                                    {title: '分享密码为空', fun: deletePassword},
                                    {title: '删除分享链接', fun: shareDelete},
                                    {title: '复制链接和密码', fun: copySourceUrl},
                                    {title: '属性', fun: attribute},
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                } else {
                    return {
                        title: m.source.name,
                        onClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '预览切换', fun: sharePreview},
                                    {title: '修改分享密码', fun: sharePassword},
                                    {title: '分享密码为空', fun: deletePassword},
                                    {title: '删除分享链接', fun: shareDelete},
                                    {title: '复制链接和密码', fun: copySourceUrl},
                                    {title: '属性', fun: attribute},
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                }
            })
            if (page == 1) {
                data.splice(0, 0, {
                    title: '分享列表如下 ("* " 开头为文件夹) -- 修改后要手动刷新',
                    style: 'category'
                })
            }
            if (go) {
                return {
                    nextPage: page + 1,
                    items: data
                }
            } else {
                return data;
            }
        } else {
            $ui.toast("请求错误 或者 列表为空");
        }
    }
}