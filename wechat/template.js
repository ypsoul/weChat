/**
 * 回复模板
 * 
 */
module.exports = (options) => {
    let replyMessage = `<xml>
    <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[${options.MsgType}]]></MsgType>`;
    if (options.MsgType === 'text') {
        replyMessage += `<Content><![CDATA[${options.Content}]]></Content>
        `;   //下面可能有问题
    } else if (options.MsgType === 'image') {
        replyMessage += `
        <PicUrl><![CDATA[${options.PicUrl}]]></PicUrl>
        <MediaId><![CDATA[${options.MediaId}]]></MediaId>
        <MsgId>{${options.MsgId}}</MsgId>`;

    } else if (options.MsgType === 'voice') {
        replyMessage += `<Voice><MediaId><![CDATA[${options.MediaId}]]></MediaId></Voice>`;
    } else if (options.MsgType === 'video') {
        replyMessage += `<Video>
        <MediaId><![CDATA[${options.MediaId}]]></MediaId>
        <Title><![CDATA[${options.Title}]]></Title>
        <Description><![${options.Description}]]></Description>
        </Video>`;
    } else if (options.MsgType === 'music') {
        replyMessage += `<Music>
        <Title><![${options.title}]></Title>
        <Description><![CDATA[${options.Description}]]></Description>
        <MusicUrl><![CDATA[${options.MusicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${options.HQMusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${options.MediaId}]]></ThumbMediaId>
      </Music>`;
    } else if (options.MsgType === 'news') {
        replyMessage += `<ArticleCount>${options.Content.length}</ArticleCount><Articles>`;
        options.Content.forEach(item => {
            replyMessage += `<item>
            <Title><![CDATA[${item.Title}]]></Title>
            <Description><![CDATA[${item.Description}]]></Description>
            <PicUrl><![CDATA[${item.PicUrl}]]></PicUrl>
            <Url><![CDATA[${item.Url}]]></Url>
          </item>`
        });
        replyMessage += `</Articles>`;
    }
    replyMessage += `</xml>`;
    console.log(replyMessage, 'replyMessage')
    return replyMessage;
}