const { parseString } = require('xml2js')
const {
    readFile,
    writeFile
} = require('fs')
const {resolve} = require('path')
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
    },
    writeFileAsync (data,filename){
        data = JSON.stringify(data)
        const fliePath = resolve(__dirname,filename);
        return new Promise((resolve, reject) => {
            writeFile(fliePath, data, err => {
                if (!err) {
                    console.log("file write success");
                    resolve();
                } else {
                    console.log(err);
                    reject('writeFileAsync 方法出错');
                }
            })
        })
    },
    readFileAsync (filename){
        const fliePath = resolve(__dirname,filename)
        return new Promise((resolve, reject) => {
            readFile(fliePath, data, err => {
                if (!err) {
                    console.log("file read success");
                    data = JSON.parse(data)
                    resolve(data);
                } else {
                    console.log(err);
                    reject('readFileAsynce 方法出错');
                }
            })
        })
    }
}