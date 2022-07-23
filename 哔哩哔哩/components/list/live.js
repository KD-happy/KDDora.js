const axios = require("axios");
const qs = require("qs");
const Danmu = require("./danmu");

var rid, order = 1, quality = 4;
var durl;

async function get_room_id(rid) {
    var r_url = `https://api.live.bilibili.com/room/v1/Room/room_init?id=${rid}`;
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    var res = await axios.get(r_url, {
        headers: headers
    })
    var data = res.data;
    if (data.code == 0) {
        if (data.data.live_status == 0) {
            return {
                msg: '未开播',
                code: false
            }
        }
        return {
            code: true,
            rid: data.data.room_id
        }
    } else {
        return {
            msg: data.msg,
            code: false
        }
    }
}

async function get_real_url(room_id, current_qn) {
    var url = 'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo';
    var param = {
        'room_id': room_id,
        'protocol': '0,1',
        'format': '0,1,2',
        'codec': '0,1',
        'qn': current_qn,
        'platform': 'h5',
        'ptype': 8,
    }
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }
    param = qs.stringify(param);
    var res = await axios.get(url + '?' + param, {
        headers: headers
    })
    var playurl_info = res.data.data.playurl_info;
    var stream = playurl_info.playurl.stream;
    var codec0 = stream[0].format[0].codec[0];
    var live_url = codec0.url_info[0].host + codec0.base_url + codec0.url_info[0].extra;
    return live_url;
}

async function playUrl(rid, quality, order) { // 房间号 画质 线路
    var url = 'http://api.live.bilibili.com/room/v1/Room/playUrl';
    var param = {
        cid: rid,
        platform: 'h5',
        quality: quality
    }
    param = qs.stringify(param);
    var res = await axios.get(url + '?' + param)
    if (res.data.code == 0) { // 请求成功
        return {
            code: true,
            quality: res.data.data.quality_description, // quality 画质
            durl: res.data.data.durl, // 线路
            url: res.data.data.durl[order - 1].url
        }
    } else {
        return {
            code: false,
            message: res.data.message
        }
    }
}

module.exports = {
    type: 'video',
    isLive: true,
    async fetch({ args }) {
        if (!args.rid) { // 判断要不要输入rid
            rid = await $input.number({
                title: '输入直播房间号',
                hint: '房间号',
                value: ''
            })
            args.rid = rid
        } else {
            rid = args.rid;
        }
        let info = await get_room_id(rid);
        if (info.code) {
            rid = info.rid;

            this.startDanmaku = () => { // 开始弹幕
                if (this.danmu == null) {
                    this.danmu = new Danmu(rid)
                    this.danmu.connect()
                    this.danmu.on('DANMU_MSG', (res) => {
                        this.addDanmaku({
                            color: res.color,
                            content: res.content,
                            author: {
                                name: res.user.name
                            }
                        })
                        console.log(`${res.user.name}: ${res.content}`)
                    })
                }
            }

            var playUrlList = await playUrl(rid, quality, order); // 原画
            durl = playUrlList.durl.map(list => {
                return list.url;
            })
            var titles = ['主线', '备线1', '备线2', '备线3'];
            return {
                url: playUrlList.url,
                selectors: [
                    {
                        title: '线路',
                        select: 0,
                        onSelect: async (option) => {
                            order = option.order;
                            this.url = durl[order - 1];
                        },
                        options: playUrlList.durl.map(list => {
                            return {
                                title: titles[list.order - 1],
                                order: list.order
                            }
                        })
                    },
                    {
                        title: '清晰度',
                        select: 0,
                        onSelect: async (option) => {
                            quality = option.quality;
                            playUrlList = await playUrl(rid, quality, order);
                            durl = playUrlList.durl.map(list => {
                                return list.url;
                            })
                            this.url = durl[order - 1];
                        },
                        options: playUrlList.quality.map(list => {
                            return {
                                title: list.desc,
                                quality: list.qn
                            }
                        })
                    }
                ]
            }
        } else {
            $ui.toast(info.msg);
            this.finish();
        }
    }
}