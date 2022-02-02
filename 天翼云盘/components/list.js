const checkBatchTask = require("./API/checkBatchTask");
const createBatchTask = require("./API/createBatchTask");
const createFolder = require("./API/createFolder");
const createShareLink = require("./API/createShareLink");
const file_listFiles = require("./API/file_listFiles");
const getFileDownloadUrl = require("./API/getFileDownloadUrl");
const renameFile = require("./API/renameFile");
const renameFolder = require("./API/renameFolder");

// var parentId;

async function rename_folder(m) { // 重新命名文件
    var newName = await $input.text({
        title: '修改文件名',
        hint: "新文件名",
        value: m.name
    })
    if (newName != null) {
        var data = await renameFolder(m.id, newName, cookie);
        if (data != false) {
            $ui.toast("重新命名成功！");
        } else {
            $ui.toast("重新命名失败！");
        }
    } else {
        $ui.toast("取消命名");
    }
}

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

async function delete_folder(m) { // 删除文件夹
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否删除文件夹: ${m.name}`,
        okBtn: "删除"
    })
    if (pd) {
        var data = await createBatchTask("DELETE", JSON.stringify([{
            fileId: m.id,
            fileName: m.name,
            isFolder: 1
        }]), "", "", cookie);
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
        }]), "", "", cookie);
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

async function copy_move_folder(m) { // 复制移动文件夹
    taskInfos = [{
        fileId: m.id,
        fileName: m.name,
        isFolder: 1
    }]
    $ui.toast("复制移动...");
}

async function copy_move_file(m) { // 复制移动文件
    taskInfos = [{
        fileId: m.id,
        fileName: m.name,
        isFolder: 0
    }]
    $ui.toast("复制移动...");
}

async function copy_to(m) { // 复制到
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否将 ${taskInfos[0].fileName} 复制到该目录`,
        okBtn: "复制"
    })
    if (pd) {
        var data = await createBatchTask("COPY", JSON.stringify(taskInfos), parentId, "", cookie);
        data = await checkBatchTask("COPY", data.taskId, cookie);
        if (data != false) {
            $ui.toast("复制成功！");
        } else {
            $ui.toast("复制失败！");
        }
    } else {
        $ui.toast("取消复制");
    }
    taskInfos = "";
}

async function move_to(m) { // 移动到
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否将 ${taskInfos[0].fileName} 移动到该目录`,
        okBtn: "移动"
    })
    if (pd) {
        var data = await createBatchTask("MOVE", JSON.stringify(taskInfos), parentId, "", cookie);
        data = await checkBatchTask("MOVE", data.taskId, cookie);
        if (data != false) {
            $ui.toast("移动成功！");
        } else {
            $ui.toast("移动失败！");
        }
    } else {
        $ui.toast("取消移动");
    }
    taskInfos = "";
}

async function create_folder(m) { // 新建文件夹
    var folder_name = await $input.text({
        title: '创建文件夹',
        hint: "新文件名",
        value: ""
    })
    var res = await createFolder(parentId, folder_name, cookie);
    if (res != false) {
        $ui.toast("创建成功！");
    } else {
        $ui.toast("创建失败！");
    }
}

async function file_attribute(m) { // 文件属性
    $ui.showCode(`文件名: ${m.name}\n文件大小: ${(m.size/1024/1024).toFixed(2)} M\n创建时间: ${m.createDate}\n修改时间: ${m.lastOpTime}`)
}

async function folder_attribute(m) { // 文件夹属性
    $ui.showCode(`文件夹名: ${m.name}\n子文件: ${m.fileCount} 个\n创建时间: ${m.createDate}\n修改时间: ${m.lastOpTime}`)
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

module.exports = {
    type: 'list',
    title: '天翼云盘',
    searchRoute: $route('list_search'),
    actions: [{title: "分享保存", route: $route("saveList")}],
    async fetch({args, page}) {
        this.title = args.title;
        getCookie();
        getOrderBy();
        parentId =  args.id;
        page = page || 1;
        var list = await file_listFiles(page, args.id, orderBy, descending, cookie);
        if (list != false) {
            var count = 0, file = [], dir = [];
            list.fileListAO.folderList.forEach(m => {
                count += 1;
                dir.push({
                    title: m.name,
                    route: $route('list', {
                        id: m.id,
                        pid: args.id,
                        title: m.name
                    }),
                    onLongClick: async () => {
                        var options = [];
                        options.push({title: '新建文件夹', fun: create_folder});
                        m.id > 0 ? options.push({title: "重新命名", fun: rename_folder}) : null;
                        taskInfos=="" ? options.push({title: '复制移动', fun: copy_move_folder}) : null;
                        taskInfos!="" ? options.push({title: '复制到', fun: copy_to}) : null;
                        taskInfos!="" ? options.push({title: '移动到', fun: move_to}) : null;
                        m.id > 0 ? options.push({title: '分享文件夹', fun: create_share_link}) : null;
                        options.push({title: '删除文件夹', fun: delete_folder});
                        options.push({title: '属性', fun: folder_attribute});
                        if (options.length > 0) {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: options
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                })
            })
            if (dir.length > 0 && page == 1) {
                dir.splice(0, 0, {
                    title: '文件夹 (单点打开、长按更多操作)',
                    style: 'category'
                })
            }
            list.fileListAO.fileList.forEach(m => {
                count += 1;
                file.push({
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
                        options.push({title: '下载文件', fun: file_downloa});
                        options.push({title: '新建文件夹', fun: create_folder});
                        options.push({title: "重新命名", fun: rename_file});
                        taskInfos=="" ? options.push({title: '复制移动', fun: copy_move_file}) : null;
                        taskInfos!="" ? options.push({title: '复制到', fun: copy_to}) : null;
                        taskInfos!="" ? options.push({title: '移动到', fun: move_to}) : null;
                        options.push({title: '分享文件', fun: create_share_link});
                        options.push({title: '删除文件', fun: delete_file});
                        options.push({title: '属性', fun: file_attribute});
                        if (options.length > 0) {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: options
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                })
            });
            if (file.length > 0 && page == 1) {
                file.splice(0, 0, {
                    title: '文件 (单点预览、长按更多操作)',
                    style: 'category'
                })
            }
            file.forEach(f => {
                dir.push(f);
            })
            if ((page-1)*60+count == list.fileListAO.count) {
                return dir;
            } else {
                return {
                    nextPage: page+1,
                    items: dir
                }
            }
        } else {
            $ui.toast("Cookie失效 可添加SSON刷新Cookie");
        }
    },
    async beforeDestroy() {
        parentId = this.args.pid;
    }
}