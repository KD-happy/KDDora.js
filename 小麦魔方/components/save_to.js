const directory = require("./API/directory");
const share_save = require("./API/share_save")


module.exports = {
    type: 'list',
    title: '保存到',
    async beforeCreate() {
        getCookie();
    },
    async fetch({args}) {
        var list = await directory(args.path, cookie);
        var data = [];
        if (args.path)
        data.push({
            title: `* ${args.path}`,
        })
        list.forEach(m => {
            if (m.type == "dir") {
                m.path.substring(m.path.length-1) == "/" ? m.path = m.path.substring(0, m.path.length-1) : null;
                data.push({
                    title: `${f.path}${f.name}`,
                    route: $route("save_to", {
                        path: m.path + '/' + m.name,
                        key: args.key
                    })
                })
            }
        })
        await share_save(args.key, args.path, cookie);
    }
}