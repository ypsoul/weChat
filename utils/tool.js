const { parseString } = require('xml2js')
module.exports = {
    // 流式信息拼接
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            req.on('data', data => {
                console.log(data)
                xmlData += data.toString();
            })
                .on('end', () => {
                    resolve(xmlData)
                })
        })
    },
    //xml to js
    parseXMLAsync(xmlData){
        return new Promise((resolve,reject)=>{
            parseString(xmlData,{trim:true},(err,data)=>{
                if(!err){
                    resolve(data)       
                }else{
                    reject("parseXMLAsync errer:" +err)
                }
            })
        })
    },
    // 字段将数组改成对应值
    formatMessage(jsData){
        let message = {};
        jsData = jsData.xml;
        //判断数据是否是一个对象
        if(typeof jsData === "object"){ 
            for(let key in jsData){
                let value = jsData[key];
                // 过滤空的数据
                if(Array.isArray(value)&&value.length>0){
                    message[key] = value[0];
                }
            }            
        }
        return message;
    }
}