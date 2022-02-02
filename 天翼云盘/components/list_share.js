const cancelShare = require("./API/cancelShare");
const listShares = require("./API/listShares");

async function attribute(m) {
    if (m.needAccessCode != null) {
        var accessCount = `转存次数: ${m.accessCount.copyCount} 次\n下载次数: ${m.accessCount.downloadCount} 次\n预览次数: ${m.accessCount.previewCount} 次\n`;
    } else {
        var accessCount = "";
    }
    m.needAccessCode != null ? share = `分享方式: 私密\n分享链接: https:${m.shortShareUrl}\n分享密码: ${m.accessCode}\n` : share = `分享方式: 公开\n分享链接: https:${m.shortShareUrl}\n`
    if (m.isFolder) {
        $ui.showCode(`文件名: ${m.fileName}\n${accessCount}审核状态: ${m.reviewStatus==1 ? "审核完成" : "正在审核"}\n${share}分享时间: ${formateTimeStamp(m.shareTime)}`);
    } else {
        $ui.showCode(`文件名: ${m.fileName}\n文件大小: ${(m.fileSize/1024/1024).toFixed(2)} M\n${accessCount}审核状态: ${m.reviewStatus==1 ? "审核完成" : "正在审核"}\n${share}分享时间: ${formateTimeStamp(m.shareTime)}`);
    }
}

async function copySourceUrl(m) {
    if (m.shareMode == 1) {
        var url = `链接: https:${m.shortShareUrl}\n密码: ${m.accessCode}`;
    } else {
        var url = `链接: https:${m.shortShareUrl}`;
    }
    $clipboard.text = url;
    $ui.toast("复制成功");
}

async function shareDelete(m) {
    var res = await cancelShare(m.shareId, cookie)
    if (res != false) {
        $ui.toast("取消成功！");
    } else {
        $ui.toast("取消失败！");
    }
}

module.exports = {
    type: 'list',
    title: '文件分享',
    async fetch({page}) {
        getCookie();
        page = page || 1;
        var list = await listShares(page, cookie);
        if (list != false) {
            var data = list.data.map(m => {
                if (m.isFolder) {
                    if (m.needAccessCode != null) {
                        var fileName = `私密* ${m.fileName}`;
                    } else {
                        var fileName = `公开* ${m.fileName}`;
                    }
                    return {
                        title: fileName,
                        onClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '取消分享链接', fun: shareDelete},
                                    {title: '复制链接和密码', fun: copySourceUrl},
                                    {title: '属性', fun: attribute},
                                ]
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    }
                } else {
                    if (m.needAccessCode != null) {
                        var fileName = `私密 ${m.fileName}`;
                    } else {
                        var fileName = `公开 ${m.fileName}`;
                    }
                    return {
                        title: fileName,
                        onClick: async () => {
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: [
                                    {title: '取消分享链接', fun: shareDelete},
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
            if (list.data.length == 30) {
                return {
                    nextPage: page + 1,
                    items: data
                }
            } else {
                return data;
            }
        }
    }
}