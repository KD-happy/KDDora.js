const searchFiles = require("./API/searchFiles");
const checkBatchTask = require("./API/checkBatchTask");
const createBatchTask = require("./API/createBatchTask");
const createShareLink = require("./API/createShareLink");
const getFileDownloadUrl = require("./API/getFileDownloadUrl");
const renameFile = require("./API/renameFile");

async function rename_file(m) { // 重新命名文件
    var newName = await $input.text({
        title: '修改文件名',
        hint: "新文件名",
        value: m.name
    })
    if (newName != null) {
        var data = await renameFile(m.id, newName, cookie);
        if (data != false) {
            $ui.toast("重新命名成功！");
        } else {
            $ui.toast("重新命名失败！");
        }
    } else {
        $ui.toast("取消命名");
    }
}

async function file_downloa(m) { // 下载文件
    var url = await getFileDownloadUrl(m.id, cookie);
    if (url != false) {
        $ui.browser(url.fileDownloadUrl);
        $ui.toast("开始下载...");
    } else {
        $ui.toast("获取失败！");
    }
}

async function create_share_link(m) { // 创建分享文件
    var selected1 = await $input.select({
        title: '有效期选择',
        options: [{title: "1天", value: 1}, {title: "7天", value: 7}, {title: "永久", value: 2099}]
    })
    if (selected1 != null) {
        var selected2 = await $input.select({
            title: '分享类型选择',
            options: [{title: "私密分享", value: 3}, {title: "公开分享", value: 2}]
        })
        if (selected2 != null) {
            var res = await createShareLink(m.id, selected1.value, selected2.value, cookie);
            if (res != false) {
                var list = res.shareLinkList;
                if (selected2.value == 3) {
                    $ui.showCode(`链接: ${list[0].url}\n密码: ${list[0].accessCode}`);
                } else {
                    $ui.showCode(`链接: ${list[0].url}`);
                }
                $ui.toast("创建成功！");
            } else {
                $ui.toast("创建失败！");
            }
        } else{
            $ui.toast("取消分享");
        }
    } else {
        $ui.toast("取消分享");
    }
}

async function delete_file(m) { // 删除文件
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否删除文件: ${m.name}`,
        okBtn: "删除"
    })
    if (pd) {
        var data = await createBatchTask("DELETE", JSON.stringify([{
            fileId: m.id,
            fileName: m.name,
            isFolder: 0
        }]), "", cookie);
        data = await checkBatchTask("DELETE", data.taskId, cookie);
        if (data != false) {
            $ui.toast("删除成功！");
        } else {
            $ui.toast("删除失败！");
        }
    } else {
        $ui.toast("取消删除");
    }
}

async function file_attribute(m) { // 文件属性
    $ui.showCode(`文件名: ${m.name}\n文件大小: ${(m.size/1024/1024).toFixed(2)} M\n创建时间: ${m.createDate}\n修改时间: ${m.lastOpTime}`)
}

module.exports = {
    type: 'list',
    async fetch({args, page}) {
        getCookie();
        getOrderBy();
        page = page || 1;
        this.title = `搜索 “${args.keyword}” 如下:`;
        var list = await searchFiles(parentId, args.keyword, page, orderBy, descending, cookie);
        if (list != false) {
            var data = list.fileList.map(m => {
                return {
                    title: m.name,
                    onClick: async () => {
                        var type = ['.flv', '.mp4', '.ts', '.mkv'];
                        var video = false;
                        type.forEach(f => {m.name.includes(f) ? video=true : null});
                        if (video) {
                            var url = await getFileDownloadUrl(m.id, cookie);
                            $router.to($route('@video', {url: url.fileDownloadUrl, title: m.name}));
                        } else if (m.name.includes(".mp3")) {
                            var url = await getFileDownloadUrl(m.id, cookie);
                            $router.to($route('@audio', {url: url.fileDownloadUrl, title: m.name}));
                        } else {
                            $ui.toast("不是指定文件格式");
                        }
                    },
                    onLongClick: async () => {
                        var options = [];
                        options.push({title: '下载文件', fun: file_downloa})
                        options.push({title: "重新命名", fun: rename_file})
                        options.push({title: '分享文件', fun: create_share_link})
                        options.push({title: '删除文件', fun: delete_file})
                        options.push({title: '属性', fun: file_attribute})
                        if (options.length > 0) {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: options
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                }
            })
            if (page == 1) {
                data.splice(0, 0, {
                    title: '文件 (单点预览、长按更多操作)',
                    style: 'category'
                })
            }
            if ((page-1)*60+list.fileList.length == list.count) {
                return data;
            } else {
                return {
                    nextPage: page+1,
                    items: data
                }
            }
        }
    }
}