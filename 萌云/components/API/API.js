const axios = require("axios");

module.exports = () => {
    var url = "https://moecloud.cn/"
    axios.defaults.baseURL = url
    axios.defaults.headers.common['Referer'] = url
    axios.defaults.headers.common["User-Agent"] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    return {
        title: '萌云',
        /**
         * 获取用户配置文件
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        config: async (cookie) => {
            let res = await axios.get('/api/v3/site/config', {
                headers: {
                    cookie: cookie
                }
            })
            return res.data.data.user;
        },
        /**
         * 复制文件
         * @param {String} dst 目标路径
         * @param {String} id 文件id
         * @param {String} src_dir 源路径
         * @param {Boolean} is_file 是否为文件
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        copy: async (dst, id, src_dir, is_file, cookie) => {
            let data = is_file ? {
                    dst: dst, src: {items: [id], dirs: []}, src_dir: src_dir
                } : {
                    dst: dst, src: {items: [], dirs: [id]}, src_dir: src_dir
                }
            try {
                var res = await axios.post('/api/v3/object/copy', data, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0;
        },
        /**
         * 创建文件夹
         * @param {String} path 路径
         * @param {String} cookie 请求Cookie
         * @returns {Boolean} 
         */
        directory_PUT: async (path, cookie) => {
            try {
                var res = await axios({
                    method: 'PUT',
                    url: '/api/v3/directory',
                    headers: {
                        cookie: cookie
                    },
                    data: {
                        path: path
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0;
        },
        /**
         * 获取文件列表
         * @param {String} path 路径
         * @param {String} cookie 请求Cookie
         * @returns {Object|Boolean} 
         */
        directory: async (path, cookie) => {
            try {
                var res = await axios.get(`/api/v3/directory${encodeURIComponent(path)}`, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data.objects : false;
        },
        /**
         * 获取文件下载连接
         * @param {String} id 文件id
         * @param {String} cookie 请求Cookie
         * @param {String|Boolean} 
         */
        download: async (id, cookie) => {
            try {
                var res = await axios({
                    method: 'PUT',
                    url: `/api/v3/file/download/${id}`,
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data : false;
        },
        /**
         * 删除文件
         * @param {String} id 文件id
         * @param {Boolean} is_file 是否为文件
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        object_delete: async (id, is_file, cookie) => {
            var data = is_file ? {items: [id], dirs: []} : {items: [], dirs: [id]}
            try {
                var res = await axios({
                    method: "DELETE",
                    data: data,
                    url: '/api/v3/object',
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0;
        },
        /**
         * 移动文件
         * @param {String} action 操作
         * @param {String} dst 目的路径
         * @param {String} id 文件id
         * @param {String} src_dir 源路径
         * @param {Boolean} is_file 是否为文件
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        object_patch: async (action, dst, id, src_dir, is_file, cookie) => {
            var data = is_file ? {
                    action: action, dst: dst, src: {dirs: [], items: [id]}, src_dir: src_dir
                } : {
                    action: action, dst: dst, src: {dirs: [id], items: []}, src_dir: src_dir
                }
            try {
                var res = await axios({
                    method: "PATCH",
                    data: data,
                    url: '/api/v3/object',
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0;
        },
        /**
         * 获取储存策略
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        policies: async (cookie) => {
            var res = await axios.get('/api/v3/user/setting/policies', {
                headers: {
                    cookie: cookie
                }
            })
            return res.data.code == 0 ? res.data.data : false;
        },
        /**
         * 切换存储策略
         * @param {String} id 存储策略id
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        policy: async (id, cookie) => {
            var data = {id: id}
            var res = await axios({
                method: 'PATCH',
                url: '/api/v3/user/setting/policy',
                data: data,
                headers: {
                    cookie: cookie
                }
            })
            return res.status == 200;
        },
        /**
         * 预览文件
         * @param {String} id 
         * @param {String} 
         */
        preview: async (id, cookie) => {
            var res = await axios.get(`/api/v3/file/preview/${id}`, {
                headers: {
                    cookie: cookie
                },
                responseType: 'stream'
            })
            return res.data.responseUrl;
        },
        /**
         * 文件夹属性
         * @param {String} id 文件ID
         * @param {Boolean} is_folder 判断是否为文件夹
         * @param {String} cookie 请求Cookie
         * @returns {Object|Boolean}
         */
        property: async (id, is_folder, cookie) => {
            var res = await axios.get(`/api/v3/object/property/${id}?trace_root=false&is_folder=${is_folder}`, {
                headers: {
                    cookie: cookie
                }
            }).catch(() => {
                console.log("请求失败！");
                return false;
            })
            return res.data.code == 0 ? res.data.data : false;
        },
        /**
         * 重新命名文件
         * @param {String} id 文件id
         * @param {Boolean} is_file 是否为文件
         * @param {String} new_name 新文件名
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        rename: async (id, is_file, new_name, cookie) => {
            var data = is_file ? {
                    action: "rename", src: {dirs: [], items: [id]}, new_name: new_name
                } : {
                    action: "rename", src: {dirs: [id], items: []}, new_name: new_name
                };
            try {
                var res = await axios.post('/api/v3/object/rename', data, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0;
        },
        /**
         * 自定义标签
         * @param {String} id 标签id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        search_tag: async (id, cookie) => {
            var res = await axios.get(`/api/v3/file/search/tag%2F${id}`, {
                headers: {
                    cookie: cookie
                }
            })
            return res.data.code != 0 ? false : res.data.data.objects;
        },
        /**
         * 搜索文件
         * @param {String} keyword 
         * @param {String} cookie 
         * @returns {Object|Boolean}
         */
        search: async (keyword, cookie) => {
            try {
                var res = await axios.get(`/api/v3/file/search/keywords/${encodeURIComponent(keyword)}`, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data.objects : false;
        },
        /**
         * 登录萌云
         * @param {String} userName 
         * @param {String} Password 
         * @returns {String|Boolean} 
         */
        session: async (userName, Password) => {
            var data = {
                Password: Password,
                userName: userName,
                captchaCode: ""
            }
            var res = await axios.post('/api/v3/user/session', data, {
                headers: {
                    'content-type': 'application/json;charset=UTF-8'
                }
            }).catch(() => {
                console.log("请求失败！");
                return false;
            })
            if (res.data.code == 0) {
                var cookies = "";
                res.headers["set-cookie"].forEach(element => {
                    cookies += (element.split("path=")[0].split("Path=")[0]);
                });
                return cookies;
            } else {
                return false;
            }
        },
        /**
         * 删除分享链接
         * @param {String} key 分享key
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        share_delete: async (key, cookie) => {
            try {
                var res = await axios({
                    method: "DELETE",
                    url: `/api/v3/share/${key}`,
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0;
        },
        /**
         * 下载分享链接的资源
         * @param {String} key 分享文件key
         * @param {String} cookie 请求Cookie
         * @returns {String}
         */
        share_download: async (key, cookie) => {
            try {
                var res = await axios({
                    method: 'PUT',
                    url: `/api/v3/share/download/${key}`,
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data : false;
        },
        /**
         * 分享文件属性
         * @param {String}} key 分享文件key
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        share_info: async (key, cookie) => {
            try {
                var res = await axios.get(`/api/v3/share/info/${key}`, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data : false;
        },
        /**
         * 获取分享链接的路径
         * @param {String} key 分享key
         * @param {String} path 文件路径
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        share_list: async (key, path, cookie) => {
            try {
                var res = await axios.get(`/api/v3/share/list/${key}${encodeURIComponent(path)}`, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data.objects : false;
        },
        /**
         * 分享链接列表
         * @param {Number} page 分享页面
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        share_page: async (page, cookie) => {
            var parames = {
                page: page,
                order_by: "created_at",
                order: "DESC"
            };
            // 分享晚早, 分享早晚, 下载大小, 下载小大, 浏览大小, 浏览小大
            var type = [
                {"order_by": "created_at", "order": "DESC"},
                {"order_by": "created_at", "order": "ASC"},
                {"order_by": "downloads",  "order": "DESC"},
                {"order_by": "downloads",  "order": "ASC"},
                {"order_by": "views",      "order": "DESC"},
                {"order_by": "views",      "order": "ASC"}
            ]
            try {
                var res = await axios.get(`/api/v3/share?page=${page}&order_by=created_at&order=DESC`, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data : false;
        },
        /**
         * 修改分享链接密码
         * @param {String} key 分享key
         * @param {String} value 更改的密码
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        share_password: async (key, value, cookie) => {
            var data = {
                prop: "password",
                value: value
            }
            var res = await axios({
                method: "PATCH",
                url: `/api/v3/share/${key}`,
                data: data,
                headers: {
                    cookie: cookie
                }
            }).catch(() => {
                console.log("请求失败！");
                return false;
            })
            return res.data.code == 0;
        },
        /**
         * 修改分享链接预览状态
         * @param {String} key 分享key
         * @param {String} value 预览改变为
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        share_preview: async (key, value, cookie) => {
            var data = {
                prop: "preview_enabled",
                value: value
            }
            var res = await axios({
                method: "PATCH",
                url: `/api/v3/share/${key}`,
                data: data,
                headers: {
                    cookie: cookie
                }
            }).catch(() => {
                console.log("请求失败！");
                return false;
            })
            return res.data.code == 0;
        },
        /**
         * 保存文件
         * @param {String} key 文件key
         * @param {String} path 保存路径
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        share_save: async (key, path, cookie) => {
            var data = {
                path: path
            }
            var res = await axios.post(`/api/v3/share/save/${key}`, data, {
                headers: {
                    cookie: cookie
                }
            })
            return res.data.code == 0;
        },
        /**
         * 搜索分享
         * @param {String} keyword 搜索关键字
         * @param {Number} page 搜索页数
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        share_search: async (keyword, page, cookie) => {
            // 分享晚早, 分享早晚, 下载大小, 下载小大, 浏览大小, 浏览小大
            var type = [
                {"order_by": "created_at", "order": "DESC"},
                {"order_by": "created_at", "order": "ASC"},
                {"order_by": "downloads",  "order": "DESC"},
                {"order_by": "downloads",  "order": "ASC"},
                {"order_by": "views",      "order": "DESC"},
                {"order_by": "views",      "order": "ASC"}
            ]
            try {
                var res = await axios.get(`/api/v3/share/search?page=${page}&order_by=created_at&order=DESC&keywords=${encodeURIComponent(keyword)}`, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.code == 0 ? res.data.data.items : false;
        },
        /**
         * 创建分享
         * @param {String} id 文件ID
         * @param {Boolean} is_dir 是否文件夹
         * @param {String} password 密码
         * @param {Boolean} preview 是否支持预览
         * @param {Number} score 下载支付积分
         * @param {String} cookie 请求Cookie
         * @returns {String} 分享连接
         */
        share: async (id, is_dir, password, preview, score, cookie) => {
            var data = {
                'downloads': -1,
                'expire': 86400,
                'id': id,
                'is_dir': is_dir,
                'password': password,
                'preview': preview,
                'score': score
            }
            try {
                var res = await axios.post('/api/v3/share', data, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0 ? res.data.data : false;
        },
        /**
         * 获取外链 不能使用
         * @param {String} id 
         * @param {String} cookie 
         * @returns {Object}
         */
        source: async (id, cookie) => {
            var res = await axios.get(`/api/v3/file/source/${id}`, {
                headers: {
                    cookie: cookie
                }
            })
            return res.data;
        },
        /**
         * 通过Cookie获取相关容量信息
         * @param {String} cookie 
         * @returns {Object} 
         */
        storage: async (cookie) => {
            var res = await axios.get('/api/v3/user/storage', {
                headers: {
                    cookie: cookie
                }
            }).catch(() => {
                console.log("请求失败！");
                return false;
            })
            return res.data.code == 0 ? res.data : false;
        },
        /**
         * 删除标签
         * @param {String} id 标签ID
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        tag_delete: async (id, cookie) => {
            var res = await axios({
                method: 'DELETE',
                url: `/api/v3/tag/${id}`,
                headers: {
                    cookie: cookie
                }
            })
            return res.data.code == 0;
        },
        /**
         * 创建正则标签
         * @param {String} name 标签名
         * @param {String} expression 文件的正则表达式
         * @param {String} cookie 请求Cookie
         * @returns {Boolean}
         */
        tag_filter: async (name, expression, cookie) => {
            var data = {
                expression: expression,
                name: name,
                color: "#e91e63",
                icon: "Heart"
            }
            try {
                var res = await axios.post('/api/v3/tag/filter', data=data, {
                    headers: {
                        cookie: cookie
                    }
                })
            } catch {
                console.log("请求失败！");
                return false;
            }
            return res.data.code == 0;
        },
        /**
         * 通过标签获取相关文件
         * @param {String} tag 
         * @param {String} cookie 
         * @returns {Object|Boolean}
         */
        tags: async (tag, cookie) => {
            var types = ['image', 'video', 'audio', 'doc'];
            var go = false;
            types.forEach(type => {
                if (tag == type) {
                    go = true;
                }
            })
            if (go) {
                var res = await axios.get(`/api/v3/file/search/${tag}/internal`, {
                    headers: {
                        cookie: cookie
                    }
                }).catch(() => {
                    console.log("请求失败！");
                    return false;
                })
                return res.data.code == 0 ? res.data.data.objects : false;
            } else {
                return false;
            }
        }
    }
}