// 引入express模块
const express = require('express')

const auth = require('./wechat/auth.js')
// app应用对象
const app = express();
// 配置模板资源目录
app.set('views','./views')
//配置模板引擎
app.set('view engine','ejs');
app.get('/search',(req,res) => {
    res.render('search')
})

//中间件没有next
app.use(auth())

//页面路由

//监听端口号
app.listen(4000,()=>console.log("服务器启用"))




