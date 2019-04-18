//获取access_token 微信调用接口的唯一凭据
// 需要的url参数
const {
    appID,
    appsecret
} = require('../config')
const rp = require('request-promise-native')
const {
    readFile,
    writeFile
} = require('fs')
const menu = require('./menu')
const api = require('../utils/api')
const { writeFileAsync ,readFileAsync } = require('../utils/tool')
class Wechat {
    constructor() {

    }
    //获取access_token
    getAccessToken() {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        // 发送请求
        // 服务器端不能ajax 使用 request request-promise-native，返回的是promise对象
        return new Promise((resolve, reject) => {
            rp({
                    method: 'get',
                    url,
                    json: true
                })
                .then(res => {
                    console.log(res)
                    res.expires_in = Date() + (res.expires_in - 300) * 1000;
                    resolve(res)
                    // { access_token:
                    //     '20_ZCrQnrFmz20x21BwfYy9b2fvJvqQPvQZ5NQMeiy5LZwRfKXgtgArpNFl-WnGDT0QvvTI94CjJ459Fy8IfFn4g00tskZ_Z76xgEDe8fXYnGXd9PwkZhQJ0_mN8FE_sVPVPz1x7OFy0RRPbyfMVXGaAJAIKT',
                    //    expires_in: 7200 }
                })
                .catch(err => {
                    console.log(err);
                    reject('getAccessToken errer')
                })
        })
    }
    //保存access_token
    /**
     * @param accessToken
     */
    saveAccessToken(accessToken) {
        //将对象转化成json字符串
        return writeFileAsync(accessToken,'access_token.txt')
    }
    // 读取access_token
    readAccessToken() {
        return readFileAsync('access_token.txt')
       
    }
    // 是否有效
    isValidAccessToken(data) {
        if (!data && data.access_token && !data.expires_in) {
            return false;
        }
        return data.expires_in > Date.now()
    }
    // 获取没有过期的access_token
    /**
     * @param
     */
    fetchAccessToken() {
        console.log(this.access_token)
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            // 保存过access_token
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in,
            })
        }
        return this.readAccessToken()
            .then(async res => {
                // 本地有文件
                if (this.isValidAccessToken(res)) {
                    resolve(res)
                } else {
                    // 过期
                    const res = await this.getAccessToken();
                    await this.saveAccessToken(res);
                    return Promise.resolve(res)
                }
            })
            .catch(async err => {
                const res = await this.getAccessToken();
                await this.saveAccessToken(res);
                return Promise.resolve(res)
            })
            .then(res => {
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                return Promise.resolve(res);
            })
    }
    //创建菜单
    createMenu(menu) {
        return new Promise(async (resolve, reject) => {
            try {
                // 获取access_token
                const data = await this.fetchAccessToken()
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`
                // 发送请求
                const result = await rp({
                    method: 'POST',
                    url,
                    json: true,
                    body: menu
                })
                resolve(result)
            } catch (e) {
                reject('createMenu errer:' + e)
            }
        })
    }
    //清空菜单
    deleteMenu() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken()
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`
                const result = await rp({
                    method: 'GET',
                    url,
                    json: true
                })
                resolve(result)
            } catch (e) {
                reject('deleteMenu errer:' + e)
            }
        })
    }
    //获取js-sdk票据
    getTicket() {
        // 发送请求
        // 服务器端不能ajax 使用 request request-promise-native，返回的是promise对象
        return new Promise((resolve, reject) => {
            const data = this.fetchAccessToken();
            const url = `${api.ticket}&access_Token=${data.access_token}`;
            rp({
                    method: 'get',
                    url,
                    json: true
                })
                .then(res => {
                    resolve({
                        ticket: res.ticket,
                        expires_in: Date.now() + (res.expires_in - 300) * 1000
                    })
                    // { access_token:
                    //     '20_ZCrQnrFmz20x21BwfYy9b2fvJvqQPvQZ5NQMeiy5LZwRfKXgtgArpNFl-WnGDT0QvvTI94CjJ459Fy8IfFn4g00tskZ_Z76xgEDe8fXYnGXd9PwkZhQJ0_mN8FE_sVPVPz1x7OFy0RRPbyfMVXGaAJAIKT',
                    //    expires_in: 7200 }
                })
                .catch(err => {
                    console.log(err);
                    reject('getTicket errer')
                })
        })
    }
    saveTicket(ticket) {
        //将对象转化成json字符串
        return writeFileAsync(ticket,'ticket.txt')
    }
    // 读取ticket
    readTicket() {
        return readFileAsync('ticket.txt')
    }
    // 是否有效
    isValidTicket(data) {
        if (!data && data.access_token && !data.expires_in) {
            return false;
        }
        return data.expires_in > data.now()
    }
    // 获取没有过期的ticket
    /**
     * @param
     */
    fetchTicket() {
        console.log(this.access_token)
        if (this.access_token && this.ticket_expires_in && this.isValidTicket(this)) {
            // 保存过Ticket
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in,
            })
        }
        return this.readTicket()
            .then(async res => {
                // 本地有文件
                if (this.isValidTicket(res)) {
                    resolve(res)
                } else {
                    // 过期
                    const res = await this.getTicket();
                    await this.saveTicket(res);
                    return Promise.resolve(res)
                }
            })
            .catch(async err => {
                const res = await this.getTicket();
                await this.saveTicket(res);
                return Promise.resolve(res)
            })
            .then(res => {
                this.access_token = res.access_token;
                this.ticket_expires_in = res.expires_in;
                return Promise.resolve(res);
            })
    }
}
// (async () => {
//     const w = new Wechat();
//     // 先删除之前菜单再创建
//     // let result = await w.deleteMenu()
//     // console.log(result)
//     // result = await w.createMenu(menu)
//     // console.log(result)
//     const data = w.fetchTicket()
//     console.log(data)
// })()

module.exports = Wechat ;