/**
 * 处理用户发送的消息类型的内容，决定返回不同的文本信息
 */
module.exports = (message) => {
    let options = {
        ToUserName:message.FromUserName,
        FromUserName:message.ToUserName,
        CreateTime:Date.now(),
        MsgType:message.MsgType,
    }

    let Content = '您在说什么，我听不清';
    if(message.MsgType === 'text'){
        if(message.Content === '0'){
            Content = '对不起，我是个警察';
        }else if (message.Content === '1'){
           Content = '以前没得选';
        }else if (message.Content === '2'){
           Content = '现在我想做个好人';
        }
    }else if(message.MsgType === 'image'){
        options.MediaId = message.MediaId;
        options.PicUrl = message.PicUrl;
        options.MsgId = message.MsgId;
    }else if(message.MsgType === 'voice'){
        options.MsgType = 'voice';
        options.MediaId = message.Recognition;
        console.log(message.Recognition)
    }else if(message.Recognition === 'location'){
        content = `维度：${message.Location_X} 经度：${message.Location_Y} 缩放大小：${message.Scale} 位置：${message.Label}`
    }else if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            // 扫描带参数的二维码关注的参数 算钱
            if(message.EventKey){
                Content = '用户使用了带参数的二维码'
            }
            content = '欢迎您的关注'
        }else if(message.Event === 'subscribe'){
            console.log('无情取关')
        }else if (message.Event === 'SCAN'){
            content = '用户已经关注 带参数的二维码'
        }else if (message.Event === 'LOCATION'){
            Content = `纬度 ：${message.Latitude} 经度：${message.Longitude}`
        }
    }else if (message.Event === 'CLICK'){
        content = `您点击了按钮:${message.EventKey}`
    }

    options.Content = Content;
    console.log(options,"options");
    return options
}