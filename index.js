// 引入express模块
const express = require('express')

const auth = require('./wechat/auth.js')

const Wechat = require('./wechat/wechat')

const { url } = require('./config')

const sha1 = require('sha1')
// app应用对象
const app = express();

const wechatApi = new Wechat();
// 配置模板资源目录
app.set('views', './views')
//配置模板引擎
app.set('view engine', 'ejs');
//页面路由
app.get('/search', async (req, res) => {
    // 生成js-sdk的签名
    //1.组合参与签名的四个参数，jsapi_ticket,noncestr(随机字符串),timestamp,url
    //中间件没有next
    const noncestr = Math.random().toString().split('.')[1];
    const timestamp = Date.now()
    // 获取票据
    const { ticket } = await wechatApi.fetchTicket()

    const arr = [
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp = ${timestamp}`,
        `url=${url}/search`
    ]
    //2.将他们字典排序，以&拼接在一起
    const str = arr.sort().join('&');
    //3.进行sha1加密，生成signature
    const signature = sha1(str)


    res.render('search', { signature, noncestr, timestamp })
})

app.use(auth())



//监听端口号
app.listen(4000, () => console.log("服务器启用"))




