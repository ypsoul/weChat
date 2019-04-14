// 引入express模块
const express = require('express')

const auth = require('./wechat/auth.js')
// app应用对象
const app = express();

app.use(auth())

//监听端口号
app.listen(4000,()=>console.log("服务器启用"))




