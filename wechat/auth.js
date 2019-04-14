// 类似中间件，封装
const config = require('../config')
const sha1 = require('sha1')
const { getUserDataAsync , parseXMLAsync ,formatMessage} = require('../utils/tool.js')
module.exports = () => {
    return async (req, res, next) => {
        // console.log(req.query)
        // { signature: '35eab388c24c9d0deafa3bd12513d6f0cac7ac03', //微信加密签名
        //   echostr: '4361760528703928317', // 微信的随机字符串
        //   timestamp: '1555216285', // 微信的发生时间
        //   nonce: '316998338' } // 随机数
        const { signature, echostr, timestamp, nonce } = req.query;
        const { token } = config;
        const arr = [timestamp, nonce, token]
        const arrSort = arr.sort();
        const str = arrSort.join('')
        const sha1Str = sha1(str)
        // const sha1Str =  sha1([timestamp,nonce,token].sort().join(''))
        // console.log(sha1Str)


        /**
         * 微信服务器发送get post两种类型的开发者给服务器
         */

        // { signature: 'd25a9573617f6915f2d56e836477e87d4062475a',
        // timestamp: '1555230176',
        // nonce: '801067515',
        // openid: 'o1Q3x03Pn0eLpM8wlwFHn7w3nObg' }
        if (req.method === "GET") {
            if (sha1Str === signature) {
                res.send(echostr)
            } else {
                res.send('wechat server error')
            }
        } else if (req.method === "POST") {
            if (sha1Str !== signature) {
                res.send("errer")
            } else {
                console.log(req.query)
            }
            const xmlData = await getUserDataAsync(req);
            // buffer数据
            console.log(xmlData)


                // < xml > 
                //     <ToUserName><![CDATA[gh_d772f38c5ba2]]></ToUserName> //开发者id
                //     <FromUserName><![CDATA[o1Q3x03Pn0eLpM8wlwFHn7w3nObg]]></FromUserName> //用户openid
                //     <CreateTime>1555231639</CreateTime> //发送的时间
                //     <MsgType><![CDATA[text]]></MsgType> //信息类型
                //     <Content><![CDATA[123]]></Content> //信息内容
                //     <MsgId>22265565114514992</MsgId> //消息id 微信服务器保存三天
                // </xml >
                // xml对象转为js对象
            const jsData = await parseXMLAsync (xmlData)
                console.log(jsData)

            /**
             * 格式化
             */
            var message = formatMessage(jsData)

            // 用户信息是否是文本信息
            let content = '您在说什么，我听不清';
            if(message.MsgType == 'text'){
                console.log("Sssss")
                if(message.Content === '0'){
                    content = '对不起，我是个警察';
                }else if (message.Content === '1'){
                    content = '以前没得选';
                }else if (message.Content === '2'){
                    content = '现在我想做个好人';
                }
            }

            let replyMessage =`<xml>
            <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
            <CreateTime>${Date.now()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${content}]]></Content>
          </xml>`
            //返回给服务器
            console.log(replyMessage)
            res.send(replyMessage);
            // res.end('')
        } else {
            res.send("errer")
        }
    }
}