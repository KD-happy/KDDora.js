const axios = require("axios");
const qs = require("qs");

module.exports = () => {
    return {
        /**
         * 取消分享
         * @param {String} shareIdList 分享id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        cancelShare: async (shareIdList, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/portal/cancelShare.action', {
                    params: {
                        shareIdList: shareIdList,
                        cancelType: 1
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 通过Code和密码获取shareId
         * @param {String} shareCode 分享Code
         * @param {String} accessCode 密码
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        checkAccessCode: async (shareCode, accessCode, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/share/checkAccessCode.action', {
                    params: {
                        shareCode: shareCode,
                        accessCode: accessCode
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 通过taskId来达到最后的操作
         * @param {String} type 操作类型
         * @param {String} taskId 操作id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        checkBatchTask: async (type, taskId, cookie) =>{
            var data = {
                'type': type, // DELETE
                'taskId': taskId
            }
            try {
                var res = await axios.post('https://cloud.189.cn/api/open/batch/checkBatchTask.action', qs.stringify(data), {
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch (error) {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 批量操作获取 taskId
         * @param {String} type 操作类型
         * @param {String} taskInfos 文件集合
         * @param {String} targetFolderId 父文件夹id
         * @param {String} shareId 分享Id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        createBatchTask: async (type, taskInfos, targetFolderId, shareId, cookie) => {
            if (shareId == "") {
                var data = {
                    'type': type, // DELETE
                    'taskInfos': taskInfos, // [{"fileId":"41381115415317398","fileName":"新建文件夹","isFolder":1}]
                    'targetFolderId': targetFolderId
                }
            } else {
                var data = {
                    'type': type, // DELETE
                    'taskInfos': taskInfos, // [{"fileId":"41381115415317398","fileName":"新建文件夹","isFolder":1}]
                    'targetFolderId': targetFolderId,
                    'shareId': shareId
                }
            }
            try {
                var res = await axios.post('https://cloud.189.cn/api/open/batch/createBatchTask.action', qs.stringify(data), {
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch (error) {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 创建文件夹
         * @param {String} parentFolderId 父亲文件夹id
         * @param {String} folderName 文件夹名
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        createFolder: async (parentFolderId, folderName, cookie) => {
            var data = {
                parentFolderId: parentFolderId,
                folderName: folderName
            }
            try {
                var res = await axios.post('https://cloud.189.cn/api/open/file/createFolder.action', qs.stringify(data), {
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 创建分享文件
         * @param {String} fileId 文件id
         * @param {Number} expireTime 过期时间 1 1天有效期 7 7天有限期 2099 永久有效
         * @param {Number} shareType 分享类型 2 公开分享  3 密码分享
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        createShareLink: async (fileId, expireTime, shareType, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/share/createShareLink.action', {
                    params: {
                        fileId: fileId, // 文件id
                        expireTime: expireTime, // 有效时间
                        shareType: shareType
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取文件id中文件和文件夹相关信息
         * @param {Number} pageNum 请求页数
         * @param {String} folderId 文件Id
         * @param {String} orderBy 排序
         * @param {Boolean} descending 降序
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        file_listFiles: async (pageNum, folderId, orderBy, descending, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/file/listFiles.action', {
                    params: {
                        pageSize: 60,
                        pageNum: pageNum,
                        folderId: folderId,
                        orderBy: orderBy,
                        descending: descending
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8', // 非常重要
                        'sign-type': '1', // 非常重要
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取文件下载地址 -- 可用来播放视频
         * @param {String} fileId 文件id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        getFileDownloadUrl: async (fileId, cookie) => {
            try {
                var res = await axios.get(`https://cloud.189.cn/api/open/file/getFileDownloadUrl.action?fileId=${fileId}`, {
                    headers: {
                        'accept': 'application/json;charset=UTF-8', // 非常重要
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取登录日志
         * @param {Number} pageNum 页面
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        getLoginLog: async (pageNum, cookie) => {
            try {
                var res = await axios.get('https://e.189.cn/user/account/getLoginLog.do', {
                    params: {
                        pageSize: 50,
                        pageNum: pageNum
                    },
                    headers: {
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.ret == 1 ? res.data : false;
        },
        /**
         * 获取文件夹路径
         * @param {String} id 文件夹id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        getObjectFolderNodes: async (id, cookie) => {
            var data = {
                id: id,
                orderBy: 1,
                order: 'ASC'
            }
            try {
                var res = await axios.post('https://cloud.189.cn/api/portal/getObjectFolderNodes.action', data, {
                    headers: {
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data;
        },
        /**
         * 获取分享信息
         * @param {String} shareId 分享id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        getShareInfo: async (shareId, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/portal/getShareInfo.action', {
                    params: {
                        shareId: shareId
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取分享信息
         * @param {String} shareCode 分享Code
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        getShareInfoByCodeV2: async (shareCode, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/share/getShareInfoByCodeV2.action?EJN3eq2myURn', {
                    params: {
                        shareCode: shareCode
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取简要用户信息
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        getUserBriefInfo: async (cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/portal/v2/getUserBriefInfo.action', {
                    headers: {
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取空间使用情况
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        getUserInfoForPortal: async (cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/user/getUserInfoForPortal.action', {
                    headers: {
                        'accept': 'application/json;charset=UTF-8', // 非常重要
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取回收站文件列表
         * @param {Number} pageNum 页数
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        listRecycleBinFiles: async (pageNum, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/file/listRecycleBinFiles.action', {
                    params: {
                        pageNum: pageNum,
                        pageSize: 30,
                        iconOption: 1,
                        family: false
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取分享文件列表
         * @param {Number} pageNum 页面
         * @param {String} fileId 文件ID
         * @param {String} shareDirFileId 分享路径文件ID
         * @param {Boolean} isFolder 是否为文件夹
         * @param {String} shareId 分享ID
         * @param {Number} shareMode 分享模式 1 有密码  2 无密码
         * @param {String} orderBy 排序
         * @param {Boolean} descending 降序
         * @param {String} accessCode 密码
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        listShareDir: async (pageNum, fileId, shareDirFileId, isFolder, shareId, shareMode, orderBy, descending, accessCode, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/share/listShareDir.action', {
                    params: {
                        pageNum: pageNum,
                        pageSize: 60,
                        fileId: fileId,
                        shareDirFileId: shareDirFileId,
                        isFolder: isFolder,
                        shareId: shareId, // 无密码的getShareInfoByCodeV2直接获得   有秘密的checkAccessCode中获得
                        shareMode: shareMode,
                        iconOption: 5,
                        orderBy: orderBy,
                        descending: descending,
                        accessCode: accessCode
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取分享列表
         * @param {Number} pageNum 页数
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        listShares: async (pageNum, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/portal/listShares.action', {
                    params: {
                        pageNum: pageNum,
                        pageSize: 30,
                        shareType: 1
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 获取新IP的COOKIE_LOGIN_USER
         * @param {String} SSON 请求Cookie
         * @returns {String}
         */
        loginUrl: async (SSON) => {
            var url = "https://cloud.189.cn/api/portal/loginUrl.action";
            try {
                await axios.get(url, {
                    headers: {
                        'cookie': "",
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    },
                    maxRedirects: 0 // 重定向次数
                })
            } catch (error) { // 重定向 302 报错
                url = error.response.headers.location;
            }
            try {
                await axios.get(url, {
                    maxRedirects: 0,
                    headers: {
                        'cookie': SSON,
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch (error) {
                url = error.response.headers.location;
            }
            try {
                await axios.get(url, {
                    maxRedirects: 0,
                    headers: {
                        'cookie': "",
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch (error) {
                return /COOKIE_LOGIN_USER=(.*); D/g.exec(JSON.stringify(error.response.headers))[1];
            }
        },
        /**
         * 获取文件路径和文件夹中的文件信息
         * @param {String} fileId 文件Id
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        portal_listFiles: async (fileId, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/portal/listFiles.action', {
                    params: {
                        fileId: fileId
                    },
                    headers: {
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 文件重命名
         * @param {String} fileId 文件Id
         * @param {String} newName 新命名
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        renameFile: async (fileId, newName, cookie) => {
            var data = {
                fileId: fileId,
                destFileName: newName
            }
            try {
                var res = await axios.post('https://cloud.189.cn/api/open/file/renameFile.action', qs.stringify(data), {
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 文件夹重命名
         * @param {String} folderId 文件夹id
         * @param {String} newName 新命名
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        renameFolder: async (folderId, newName, cookie) => {
            var data = {
                'folderId': folderId,
                'destFolderName': newName
            }
            try {
                var res = await axios.post('https://cloud.189.cn/api/open/file/renameFolder.action', qs.stringify(data), {
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        },
        /**
         * 搜索
         * @param {String} folderId 搜索目录 文件夹id
         * @param {String} filename 搜索文件名
         * @param {Number} pageNum 页数
         * @param {String} orderBy 排序
         * @param {Boolean} descending 降序
         * @param {String} cookie 请求Cookie
         * @returns {Object}
         */
        searchFiles: async (folderId, filename, pageNum, orderBy, descending, cookie) => {
            try {
                var res = await axios.get('https://cloud.189.cn/api/open/file/searchFiles.action', {
                    params: {
                        'folderId': folderId,
                        'pageSize': '60',
                        'pageNum': pageNum,
                        'filename': filename,
                        'recursive': 1,
                        'iconOption': 5,
                        'orderBy': orderBy, // 排序
                        'descending': descending
                    },
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'sign-type': '1',
                        'cookie': cookie,
                        'referer': 'https://cloud.189.cn/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                    }
                })
            } catch {
                console.log("请求错误！");
                return false;
            }
            return res.data.res_code != null ? res.data : false;
        }
    }
}