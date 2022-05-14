const axios = require("axios");
const config = require("./API/config");
const share_save = require("./API/share_save");

// var cookie;
var items = [
    {
        title: '全部',
        route: $route('list', {path: '', ppath: '', title: '萌云'})
    },
    {
        title: '视频',
        route: $route('tag', {tag: 'video', title: '视频'})
    },
    {
        title: '图片',
        route: $route('tag', {tag: 'image', title: '图片'})
    },
    {
        title: '音频',
        route: $route('tag', {tag: 'audio', title: '音频'})
    },
    {
        title: '文档',
        route: $route('tag', {tag: 'doc', title: '文档'})
    },
    {
        title: '分享页面列表',
        route: $route('shareList')
    },
    {
        title: '萌云配置',
        route: $route('login')
    }
];

module.exports = {
    type: 'drawer',
    title: '萌云',
    searchRoute: $route('search'),
    actions: [
        {
            title: '搜索分享',
            route: $route("share_search")
        },
        {
            title: '保存Key',
            onClick: async () => {
                var key = await $input.text({
                    title: '分享文件Key',
                    hint: '文件Key',
                    value: ''
                });
                if (key != null) {
                    key = key.split("/");
                    key = key[key.length - 1];
                    key = key.split("?")[0];
                    if (await share_save(key, path=="" ? "/" : path, cookie)) {
                        $ui.toast("保存成功");
                    } else {
                        $ui.toast("保存错误");
                    }
                } else {
                    $ui.toast("取消保存");
                }
            }
        }
    ],
    beforeCreate() {
        getCookie();
    },
    async fetch() {
        var info = await config(cookie);
        var tags = info.tags.map(m => {
            return {
                id: m.id,
                name: m.name
            }
        })
        tags.forEach(f => {
            var json = {
                title: f.name,
                route: $route('self_tag', {id: f.id})
            }
            items.splice(items.length-2, 0, json);
        })
        return {
            items: items
        }
    }
}