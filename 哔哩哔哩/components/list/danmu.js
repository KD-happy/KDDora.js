const WebSocket = require('ws');
const axios = require('axios');
const pako = require('pako');
const brotli = require('brotli');
const EventEmitter = require('events');

const makePacket = (op, data) => {
  let buf = Buffer.alloc(data.length + 16)
  buf.writeUIntBE(data.length + 16, 0, 4) // 封包总长度
  buf.writeUIntBE(16, 4, 2) // 封包头部长度
  buf.writeUIntBE(1, 6, 2) // 协议版本
  buf.writeUIntBE(op, 8, 4) // 操作码
  buf.writeUIntBE(1, 12, 4) // 序列号
  buf.write(data, 16) // 封包正文
  return buf
}

const readPacket = (buf) => {
  const totLen = buf.readUIntBE(0, 4), // 封包总长度
        headLen = buf.readUIntBE(4, 2), // 封包头部长度
        protover = buf.readUIntBE(6, 2), // 协议版本
        op = buf.readUIntBE(8, 4), // 操作码
        seq = buf.readUIntBE(12, 4), // 序列号
        raw = buf.subarray(headLen, totLen)// 原始数据
  return {
    totLen,
    headLen,
    protover,
    op,
    seq,
    raw
  }
}

const textDecoder = new TextDecoder('utf-8')

class Danmu extends EventEmitter {
  constructor(room) {
    super()

    this.room = room
  }

  async connect() {
    const { data: danmuInfo } = await axios.get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${this.room}&type=0`)
    this.token = danmuInfo.data.token
    this.host = danmuInfo.data.host_list[0].host

    this.ws = new WebSocket(`wss://${this.host}/sub`)

    this.ws.on('close', () => {
      console.log("关闭了")
      this.emit('disconnect')
    })

    this.ws.on('message', (data) => {
      this.emit('packet', data)
      const body = this._decodePacket(data)
      body.forEach((i) => {
        let obj
        try {
          obj = JSON.parse(i)
        } catch {
          if (i.length > 1) i = i.slice(0, -1)
          try {
            obj = JSON.parse(i)
          } catch {
            return
          }
        }
        this.emit('act', obj)
        this._route(obj)
      })
    })

    this.ws.on('open', () => {
      this.emit('ws')
      
      // 发送认证包
      const data = JSON.stringify({
        uid: 0,
        roomid: this.room,
        protover: 3,
        platform: 'web',
        type: 2,
        key: this.token
      })
      this.ws.send(makePacket(7, data))
      
      // 开始发送心跳
      this.hbTimer = setInterval(() => {
        this.ws.send(makePacket(2, '[object Object]'))
      }, 1000 * 30)
    })
  }

  _decodePacket(pkt) {
    const data = readPacket(pkt)
    if (data.op === 3) { // 人气值更新
      this.emit('pop', data.raw.readUIntBE(0, 4))
      return []
    }
    if (data.op === 8) { // 进房
      this.emit('ready')
      return []
    }
    if (data.op !== 5) return []
    // 处理指令包
    let res
    switch (data.protover) {
      case 0:
        res = textDecoder.decode(data.raw)
        break
      case 2:
        res = textDecoder.decode(pako.inflate(data.raw))
        break
      case 3:
        res = textDecoder.decode(brotli.decompress(data.raw))
        break
      default:
        break
    }
    let ls = []
    for (;;) {
      let l = res.indexOf(`{"cmd`)
      if (l === -1) break

      let r = res.indexOf(`{"cmd`, l + 1)
      if (r === -1) r = res.length - 1
      r = res.lastIndexOf('}', r)

      ls.push(res.slice(l, r + 1))

      res = res.slice(r + 1)
    }
    return ls
  }

  _route(data) {
    if (this.handlers[data.cmd]) {
      this.handlers[data.cmd](data)
    } else {
      this.emit('unhandled', data)
    }
  }

  _simpleHandler = (ename) => {
    return (data) => {
      this.emit('ename', data.data)
    }
  }

  handlers = {
    'DANMU_MSG': (data) => { // 弹幕消息
      const x = data.info
      let res = {
        content: x[1],
        time: x[0][4],
        type: x[0][12], // 0: 文字 1:表情 其他不清楚
        redbag: x[0][9], // 2: 抽奖 0：不是 ？
        position: x[0][1], // 4: 底端 1: 滚动 ?
        color: x[0][3].toString(16).toUpperCase(),
        user: {
          uid: x[2][0],
          name: x[2][1],
          ad: x[2][2], // 是否是房管 ？
        }
      }
      if (x[3]) {
        res.medal = {
          level: x[3][0],
          name: x[3][1],
          boat: x[3][10], // 0：无 1：舰长 2：提督 3：总督 ？
        }
      }
      this.emit('DANMU_MSG', res)
    },
    'INTERACT_WORD': this._simpleHandler('INTERACT_WORD'), // 不知道什么玩意 但是贼多
    'WATCHED_CHANGE': this._simpleHandler('WATCHED_CHANGE'), // 看过的人数变化
    'ONLINE_RANK_COUNT': this._simpleHandler('ONLINE_RANK_COUNT'), // 在线人数排名变化
    'ONLINE_RANK_V2': this._simpleHandler('ONLINE_RANK_V2'), // 在线人数排名变化v2
    'ONLINE_RANK_TOP3': this._simpleHandler('ONLINE_RANK_TOP3'), // 在线人数排名前三
    'HOT_RANK_CHANGED': this._simpleHandler('HOT_RANK_CHANGED'), // 热门排名变化
    'HOT_RANK_CHANGED_V2': this._simpleHandler('HOT_RANK_CHANGED_V2'), // 热门排名变化v2
    'SEND_GIFT': this._simpleHandler('SEND_GIFT'), // 送礼
    'COMBO_SEND': this._simpleHandler('COMBO_SEND'), // 连续送礼
    'WIDGET_BANNER': this._simpleHandler('WIDGET_BANNER'), // 不懂
    'STOP_LIVE_ROOM_LIST': this._simpleHandler('STOP_LIVE_ROOM_LIST'), // 下播的房间
    'ROOM_REAL_TIME_MESSAGE_UPDATE': this._simpleHandler('ROOM_REAL_TIME_MESSAGE_UPDATE'), // 一些信息更新
    'ENTRY_EFFECT': this._simpleHandler('ENTRY_EFFECT'), // 欢迎进房
  }
}

module.exports=Danmu