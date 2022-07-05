const API = require("./API/API");
const api = API();

var taskInfos=[];

var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function empty_recycle() { // 清空回收站
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否清空回收站`,
        okBtn: "清空"
    })
    if (pd) {
        var res = await api.createBatchTask("EMPTY_RECYCLE", JSON.stringify([]), "", "", cookie);
        if (res != false) {
            var taskId = res.taskId;
            do {
                res = await api.checkBatchTask("EMPTY_RECYCLE", taskId, cookie);
                sleep(500);
            } while (res != false && res.taskStatus == 1);
            if (res != false) {
                if (res.taskStatus == 4) {
                    $ui.toast("清空成功！");
                } else {
                    $ui.toast("清空失败！");
                }
            } else {
                $ui.toast("未知错误！");
            }
        } else {
            $ui.toast("未知错误！");
        }
    } else {
        $ui.toast("取消清空");
    }
}

async function delete_file(m) { // 删除文件
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否删除文件: ${m.name}`,
        okBtn: "删除"
    })
    if (pd) {
        var data = await api.createBatchTask("CLEAR_RECYCLE", JSON.stringify([{
            fileId: m.id,
            fileName: m.name,
            isFolder: 0
        }]), "", "", cookie);
        data = await api.checkBatchTask("CLEAR_RECYCLE", data.taskId, cookie);
        if (data != false) {
            $ui.toast("删除成功！");
        } else {
            $ui.toast("删除失败！");
        }
    } else {
        $ui.toast("取消删除");
    }
}

async function restore(m) { // 还原文件
    var data = await api.createBatchTask("RESTORE", JSON.stringify([{
        fileId: m.id,
        fileName: m.name,
        isFolder: 0
    }]), "", "", cookie);
    data = await api.checkBatchTask("RESTORE", data.taskId, cookie);
    if (data != false) {
        $ui.toast("还原成功！");
    } else {
        $ui.toast("还原失败！");
    }
}

async function Restore() { // 还原30文件
    var data = await api.createBatchTask("RESTORE", JSON.stringify(taskInfos), "", "", cookie);
    if (data != false) {
        var taskId = data.taskId;
        do {
            data = await api.checkBatchTask("RESTORE", taskId, cookie);
            sleep(500);
        } while (data != false && data.taskStatus == 3);
        if (data != false) {
            if (data.taskStatus == 4) {
                $ui.toast("还原成功！");
            } else {
                $ui.toast("还原失败！");
            }
        } else {
            $ui.toast("未知错误！");
        }
    } else {
        $ui.toast("未知错误！");
    }
}

async function attribute(m) { // 属性
    $ui.showCode(`文件名: ${m.name}\n文件大小: ${(m.size/1024/1024).toFixed(2)} M\n恢复路径: ${m.pathStr}\n创建时间: ${m.createDate}\n删除时间: ${m.lastOpTime}`)
}

module.exports = {
    type: 'list',
    title: '回收站',
    actions: [
        {
            title: "清空回收站",
            onClick: async () => {
                empty_recycle();
            }
        },
        {
            title: "还原",
            onClick: async () => {
                Restore();
            }
        }
    ],
    async fetch({page}) {
        getCookie();
        page = page || 1;
        var list = await api.listRecycleBinFiles(page, cookie);
        var data = [];
        if (list != false) {
            list.fileList.forEach(m => {
                taskInfos.push({
                    fileId: m.id,
                    fileName: m.name,
                    isFolder: 0
                })
                data.push({
                    title: m.name,
                    onClick: () => {
                        $ui.toast(m.name);
                    },
                    onLongClick: async () => {
                        var options = [];
                        options.push({title: '删除文件', fun: delete_file})
                        options.push({title: '还原文件', fun: restore})
                        options.push({title: '属性', fun: attribute})
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
            if (list.fileListSize < 30) {
                return data;
            } else {
                console.log(list.fileListSize, page)
                return {
                    nextPage: page+1,
                    items: data
                }
            }
        }
    }
}