const folder_created_list_all = require("../API/folder_created_list_all");

module.exports = {
    type: 'topTab',
    title: '哔哩哔哩 - 收藏夹',
    async fetch({page}) {
        page = page || 1;
        var list = await folder_created_list_all(mid, cookie);
        if (list != false) {
            var data = list.map(m => {
                return {
                    title: m.title,
                    route: $route('list/Folder', {
                        id: m.id
                    })
                }
            })
            return data;
        }
    },
    beforeCreate() {
        getCookie();
    }
}