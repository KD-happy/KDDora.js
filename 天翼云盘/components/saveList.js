const listShareDir = require("./API/listShareDir");
const checkAccessCode = require("./API/checkAccessCode");
const getShareInfoByCodeV2 = require("./API/getShareInfoByCodeV2");
const createBatchTask = require("./API/createBatchTask");
const checkBatchTask = require("./API/checkBatchTask");

var shareCode, fileId, fileName, isFolder, shareId="", shareMode, accessCode;

var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function checkAccess(shareCode, accessCode) { // 需要密码的 获取shareId
    var check = await checkAccessCode(shareCode, accessCode, cookie);
    shareId = check.shareId;
}

async function getShareInfo(shareCode) { // 获取分享链接信息
    var info =  await getShareInfoByCodeV2(shareCode, cookie);
    if (info != false) {
        fileId = info.fileId;
        isFolder = info.isFolder;
        shareMode = info.shareMode;
        fileName = info.fileName;
        if (shareMode != 1) { // 不需要密码
            shareId = info.shareId;
        }
        return info.fileName;
    } else {
        return false;
    }
}

async function folder_attribute(m) { // 文件夹属性
    $ui.showCode(`文件夹名: ${m.name}\n创建时间: ${m.createDate}\n修改时间: ${m.lastOpTime}`)
}

async function file_attribute(m) { // 文件属性
    $ui.showCode(`文件名: ${m.name}\n文件大小: ${(m.size/1024/1024).toFixed(2)} M\n创建时间: ${m.createDate}\n修改时间: ${m.lastOpTime}`)
}

async function folder_save(m) { // 文件夹保存
    var res = await createBatchTask("SHARE_SAVE", JSON.stringify([{
        fileId: m.id,
        fileName: m.name,
        isFolder: 1
    }]), parentId, shareId, cookie);
    if (res != false) {
        var taskId = res.taskId;
        do {
            res = await checkBatchTask("SHARE_SAVE", taskId, cookie);
            sleep(500);
        } while (res != false && res.taskStatus == 3);
        if (res != false) {
            if (res.taskStatus == 4) {
                $ui.toast("保存成功！");
            } else {
                $ui.toast("保存失败！");
            }
        } else {
            $ui.toast("未知错误！");
        }
    } else {
        $ui.toast("未知错误！");
    }
}

async function file_save(m) { // 文件保存
    var res = await createBatchTask("SHARE_SAVE", JSON.stringify([{
        fileId: m.id,
        fileName: m.name,
        isFolder: 0
    }]), parentId, shareId, cookie);
    if (res != false) {
        var taskId = res.taskId;
        do {
            res = await checkBatchTask("SHARE_SAVE", taskId, cookie);
            sleep(500);
        } while (res != false && res.taskStatus == 3);
        if (res != false) {
            if (res.taskStatus == 4) {
                $ui.toast("保存成功！");
            } else {
                $ui.toast("保存失败！");
            }
        } else {
            $ui.toast("未知错误！");
        }
    } else {
        $ui.toast("未知错误！");
    }
}

module.exports = {
    type: 'list',
    title: '保存分享列表',
    async fetch({args, page}) {
        getCookie();
        getOrderBy();
        page = page || 1;
        if (page == 1 && args.fileId == undefined) {
            shareCode = await $input.text({
                title: "请输入分享Code",
                hint: "shareCode",
                value: ""
            })
            if (shareCode != null) {
                shareCode = /\/?([a-zA-Z0-9]{12})/g.exec(shareCode)[1];
                var fileName = await getShareInfo(shareCode);
                if (fileName != false) {
                    this.title = fileName;
                    if (shareMode == 1) {
                        accessCode = await $input.text({
                            title: "请输入密码",
                            hint: "密码",
                            value: ""
                        })
                        if (accessCode != null) {
                            await checkAccess(shareCode, accessCode)
                        } else {
                            $ui.toast("不输入密码");
                            this.finish();
                            return;
                        }
                        var list = await listShareDir(page, fileId, fileId, isFolder, shareId, shareMode, orderBy, descending, accessCode, cookie);
                    } else {
                        var list = await listShareDir(page, fileId, fileId, isFolder, shareId, shareMode, orderBy, descending, accessCode, cookie);
                    }
                    if (isFolder) {
                        this.actions = [{
                            title: '保存全部',
                            onClick: async () => {
                                folder_save({id: fileId, name: fileName})
                            }
                        }]
                    } else {
                        this.actions = [{
                            title: '保存全部',
                            onClick: async () => {
                                file_save({id: fileId, name: fileName})
                            }
                        }]
                    }
                } else {
                    $ui.toast("分享Code已失效");
                }
            } else {
                $ui.toast("不输入分享Code");
                this.finish();
                return;
            }
        } else {
            if (args.fileId == undefined) { // 单个文件夹
                var list = await listShareDir(page, fileId, fileId, isFolder, shareId, shareMode, orderBy, descending, accessCode, cookie);
            } else { // 点击文件夹后
                this.title = args.title;
                var list = await listShareDir(page, args.fileId, args.fileId, args.isFolder, shareId, args.shareMode, orderBy, descending, args.accessCode, cookie);    
            }
        }
        if (list != false) {
            var file=[], folder=[], count=0;
            if (page == 1 && args.fileId == undefined) {
                list.fileListAO.folderList.forEach(m => {
                    count += 1;
                    folder.push({
                        title: m.name,
                        route: $route("saveList", {
                            fileId: m.id,
                            title: m.name,
                            isFolder: isFolder,
                            shareId: shareId,
                            shareMode: shareMode,
                            accessCode: accessCode
                        }),
                        onLongClick: async () => {
                            var options = [];
                            options.push({title: "保存文件夹", fun: folder_save})
                            options.push({title: "属性", fun: folder_attribute})
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
            } else {
                list.fileListAO.folderList.forEach(m => {
                    count += 1;
                    folder.push({
                        title: m.name,
                        route: $route("saveList", {
                            fileId: m.id,
                            title: m.name,
                            isFolder: args.isFolder,
                            shareId: shareId,
                            shareMode: args.shareMode,
                            accessCode: args.accessCode
                        }),
                        onLongClick: async () => {
                            var options = [];
                            options.push({title: "保存文件夹", fun: folder_save})
                            options.push({title: "属性", fun: folder_attribute})
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
            }
            if (folder.length > 0 && page == 1) {
                folder.splice(0, 0, {
                    title: '文件夹 (单点打开、长按更多操作)',
                    style: 'category'
                })
            }
            list.fileListAO.fileList.forEach(m => {
                count += 1;
                file.push({
                    title: m.name,
                    onLongClick: async () => {
                        var options = [];
                        options.push({title: "文件保存", fun: file_save})
                        options.push({title: "属性", fun: file_attribute})
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
            if (file.length > 0 && page == 1) {
                file.splice(0, 0, {
                    title: '文件 (长按更多操作)',
                    style: 'category'
                })
            }
            file.forEach(f => {
                folder.push(f);
            })
            if (isFolder) {
                if ((page-1)*60+count == list.fileListAO.count) {
                    return folder;
                } else {
                    return {
                        nextPage: page+1,
                        items: folder
                    }
                }
            } else {
                return folder;
            }
        } else {
            $ui.toast("密码错误");
            this.refresh();
        }
    }
}