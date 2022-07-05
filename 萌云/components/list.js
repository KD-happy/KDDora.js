const API = require("./API/API");
const api = API();

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
    if (m.type == "dir") {
        var info = await api.property(m.id, true, cookie);
        $ui.showCode(`文件夹名: ${m.name}\n文件夹大小: ${(info.size/1024/1024).toFixed(2)}M\n子文件夹: ${info.child_folder_num}\n子文件: ${info.child_file_num}\n创建时间: ${formatUtcTime(info.created_at)}\n更新时间: ${formatUtcTime(info.updated_at)}\n查询时间: ${formatUtcTime(info.query_date)}`);
    } else {
        var info = await api.property(m.id, false, cookie);
        $ui.showCode(`文件名: ${m.name}\n文件大小: ${(info.size/1024/1024).toFixed(2)}M\n创建时间: ${formatUtcTime(info.created_at)}\n更新时间: ${formatUtcTime(info.updated_at)}\n查询时间: ${formatUtcTime(info.query_date)}\n储存节点: ${info.policy}`);
    }
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
        if (m.type == "dir") {
            var data = await api.share(m.id, true, password, true, 0, cookie);
        } else {
            var data = await api.share(m.id, false, password, true, 0, cookie);
        }
        if (data != false) {
            $ui.toast("分享成功");
            $ui.showCode(`链接: ${data}\n密码: ${password}`);
        } else {
            $ui.toast("分享失败");
        }
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
    var data = await api.rename(m.id, true, new_name, cookie);
    if (data) {
        $ui.toast("重新命名成功！");
    } else {
        $ui.toast("重新命名失败！");
    }
}

async function dir_create(m) { // 创建文件夹
    // var path = m.path[m.path.length-1]=="/" ? m.path.substring(0, m.path.length-1) : "";
    var dir_name = await $input.text({
        title: '创建文件夹',
        hint: '文件夹名',
        value: ''
    })
    var data = await api.directory_PUT(`${path}/${dir_name}`, cookie);
    if (data) {
        $ui.toast("创建成功！");
    } else {
        $ui.toast("创建失败！");
    }
}

async function dir_rename(m) { // 重新命名文件夹
    var new_name = await $input.text({
        title: '修改文件夹名',
        hint: "新文件夹名",
        value: m.name
    })
    var data = await api.rename(m.id, false, new_name, cookie);
    if (data) {
        $ui.toast("重新命名成功！");
    } else {
        $ui.toast("重新命名失败！");
    }
}

async function file_delete(m) { // 删除文件
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否删除文件: ${m.name}`,
        okBtn: "删除"
    })
    if (pd) {
        var data = await api.object_delete(m.id, true, cookie);
        if (data) {
            $ui.toast("删除文件成功！");
        } else {
            $ui.toast("删除文件失败！");
        }
    } else {
        $ui.toast("取消删除");
    }
}

async function dir_delete(m) { // 删除文件夹
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否删除文件夹: ${m.name}`,
        okBtn: "删除"
    })
    if (pd) {
        var data = await api.object_delete(m.id, false, cookie);
        if (data) {
            $ui.toast("删除文件夹成功！");
        } else {
            $ui.toast("删除文件夹失败！");
        }
    } else {
        $ui.toast("取消删除");
    }
}

async function file_down(m) { // 文件下载
    var url = await api.download(m.id, cookie);
    if (url != false) {
        $ui.browser(url);
        $ui.toast("开始下载...");
    } else {
        $ui.toast("获取失败");
    }
}

async function copy_move_file(m) { // 复制移动文件
    src_dir = m.path;
    mid = m.id;
    isFile = true;
    $ui.toast("复制移动...");
}

async function copy_move_folder(m) { // 复制移动文件
    src_dir = m.path!="" ? m.path : "/";
    mid = m.id;
    isFile = false;
    $ui.toast("复制移动...");
}

async function copy_to(m) { // 复制
    let pd = await $input.confirm({
        title: "确认框",
        message: `是否复制到该目录`,
        okBtn: "复制"
    })
    if (pd) {
        if (await api.copy(path=="" ? "/" : path, mid, src_dir, isFile, cookie)) {
            $ui.toast("复制成功");
        } else {
            $ui.toast("复制失败");
        }
    } else {
        $ui.toast("取消复制");
    }
    src_dir = "";
}

async function move_to(m) { // 移动到
    let pd = await $input.confirm({
        title: "确认框",
        message: "是否移动到该目录",
        okBtn: "移动"
    })
    if (pd) {
        if (await api.object_patch("move", path=="" ? "/" : path, mid, src_dir, isFile, cookie)) {
            $ui.toast("移动成功");
        } else {
            $ui.toast("移动失败");
        }
    } else {
        $ui.toast("取消移动");
    }
    src_dir = "";
}

module.exports = {
    type: 'list',
    beforeCreate() {
        getCookie();
    },
    async fetch({args}) {
        this.title = args.title;
        path = args.path;
        var list = await api.directory(args.path, cookie);
        if (list == false && typeof(list) == "boolean") {
            $router.to($route('login'));
            $ui.toast("Cookie已失效，请登录！");
        } else {
            var dir = [];
            list.forEach(m => {
                if (m.type == "dir") {
                    m.path.substring(m.path.length-1) == "/" ? m.path = m.path.substring(0, m.path.length-1) : null;
                    dir.push({
                        title: m.name,
                        route: $route("list", {
                            path: m.path + '/' + m.name,
                            ppath: m.path,
                            title: m.name
                        }),
                        onLongClick: async () => {
                            var options = [];
                            options.push({title: '创建文件夹', fun: dir_create});
                            options.push({title: '重新命名', fun: dir_rename});
                            src_dir=="" ? options.push({title: '复制移动', fun: copy_move_folder}) : null;
                            src_dir!="" ? options.push({title: '复制到', fun: copy_to}) : null;
                            src_dir!="" ? options.push({title: '移动到', fun: move_to}) : null;
                            options.push({title: '分享文件夹', fun: make_share});
                            options.push({title: '删除文件夹', fun: dir_delete});
                            options.push({title: '属性', fun: attribute});
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: options
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    });
                }
            });
            if (dir.length > 0) {
                dir.splice(0, 0, {
                    title: '文件夹 (单点打开、长按更多操作)',
                    style: 'category'
                })
            }
            var file = [];
            list.forEach(m => {
                if (m.type == "file") {
                    file.push({
                        title: m.name,
                        onClick: async () => {
                            var type = ['.flv', '.mp4', '.ts', '.mkv'];
                            var video = false;
                            type.forEach(f => {m.name.includes(f) ? video=true : null});
                            if (video) {
                                var url = await api.preview(m.id, cookie);
                                $router.to($route('@video', {url: url, title: m.name}));
                            } else {
                                $ui.toast("不是指定文件格式");
                            }
                        },
                        onLongClick: async () => {
                            var options = [];
                            options.push({title: '创建文件夹', fun: dir_create});
                            options.push({title: '文件下载', fun: file_down});
                            options.push({title: '重新命名', fun: file_rename});
                            src_dir=="" ? options.push({title: "复制移动", fun: copy_move_file}) : null;
                            src_dir!="" ? options.push({title: '复制到', fun: copy_to}) : null;
                            src_dir!="" ? options.push({title: '移动到', fun: move_to}) : null;
                            options.push({title: '分享文件', fun: make_share});
                            options.push({title: '删除文件', fun: file_delete});
                            options.push({title: '属性', fun: attribute});
                            var selected = await $input.select({
                                title: '选择哪一个',
                                options: options
                            })
                            selected != null ? selected.fun(m) : null;
                        }
                    });
                }
            });
            if (file.length > 0) {
                file.splice(0, 0, {
                    title: '文件 (单点预览、长按更多操作)',
                    style: 'category'
                })
            }
            file.forEach(f => {
                dir.push(f);
            })
            this.actions = [{title: '搜索分享', route: $route("share_search")}];
            if (list.length == 0) {
                let actions = this.actions==undefined ? [] : this.actions;
                actions.push({
                    title: '创建文件夹',
                    onClick: () => {
                        dir_create();
                    }
                })
                if (src_dir != "") {
                    actions.push({
                        title: '复制到',
                        onClick: () => {
                            copy_to();
                        }
                    })
                    actions.push({
                        title: '移动到',
                        onClick: () => {
                            move_to();
                        }
                    })
                }
                this.actions = actions;
            }
            return dir;
        }  
    },
    async beforeDestroy() {
        path = this.args.ppath;
    }
}