//获取access_token 微信调用接口的唯一凭据
// 需要的url参数
const {appID , appsecret} = require('../config')
const rp = require('request-promise-native')
const {readFile , writeFile} = require('fs')
class Wechat {
    constructor(){

    }
    //获取access_token
    getAccessToken(){
        const url =`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        // 发送请求
        // 服务器端不能ajax 使用 request request-promise-native，返回的是promise对象
        return new Promise((resolve,reject) => {
            rp({method:'get',url,json:true})
            .then(res =>{
                console.log(res)
                res.expires_in = Date() + (res.expires_in -300)*1000;
                resolve(res)
                // { access_token:
                //     '20_ZCrQnrFmz20x21BwfYy9b2fvJvqQPvQZ5NQMeiy5LZwRfKXgtgArpNFl-WnGDT0QvvTI94CjJ459Fy8IfFn4g00tskZ_Z76xgEDe8fXYnGXd9PwkZhQJ0_mN8FE_sVPVPz1x7OFy0RRPbyfMVXGaAJAIKT',
                //    expires_in: 7200 }
            })
            .catch(err =>{
                console.log(err);
                reject('getAccessToken errer')
            })
        })
    }
    //保存access_token
    /**
     * @param accessToken
     */
    saveAccessToken(accessToken){
        //将对象转化成json字符串
        accessToken = JSON.stringify(accessToken);

        return new Promise((resolve,reject)=>{
            writeFile('./accessToken.txt',accessToken,err => {
                if(!err){
                    console.log("file write success");
                    resolve();
                }else{
                    console.log(err);
                    reject();
                }
            })
        })
    }
    // 读取access_token
    readAccessToken(){
        return new Promise((resolve,reject)=>{
            readFile('./accessToken.txt',(err,data) => {
                if(!err){
                    console.log("file read success");
                    data = JSON.parse(data)
                    resolve(data);
                }else{
                    console.log(err);
                    reject();
                }
            })
        })
    }
    // 是否有效
    isValidAccessToken(data){
        if(!data&&data.access_token&&!data.expires_in){
            return false;
        }
        return data.expires_in > data.now()
    }
    // 获取没有过期的access_token
    /**
     * @param
     */
    fetchAccessToken(){
        console.log(this.access_token)
        if(this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            // 保存过access_token
            return Promise.resolve({
                access_token:this.access_token,
                expires_in:this.expires_in,
            })
        }
        return this.readAccessToken()
            .then( async res => {
                // 本地有文件
                if(this.isValidAccessToken(res)){
                    resolve(res)
                }else{
                    // 过期
                const res= await this.getAccessToken();
                await this.saveAccessToken(res);
                return Promise.resolve(res)
                }
            })
            .catch( async err => {
                const res= await this.getAccessToken();
                await this.saveAccessToken(res);
                return Promise.resolve(res)
            })
            .then(res => {
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                return Promise.resolve(res);
            })        
    }
}



