let app = require('express')();
let apiconfig = require('./apiconfig.js');
let config = require('./config.js');
let url = require("url");
let wxcofig = null;
function tpl(timestamp,nonceStr,signature,jsApiList){
    return {
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxb0aa0a10ba792e81', // 必填，公众号的唯一标识
                timestamp:timestamp , // 必填，生成签名的时间戳
                nonceStr:nonceStr, // 必填，生成签名的随机串
                signature:signature ,// 必填，签名，见附录1
                jsApiList:jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };
}
app.use(require('express-xml-bodyparser')());
app.use(require('./auth.js'));
app.use(require('./token.js'));
app.use(require('./jsticket.js'));
app.use('/view/',(req,res,next)=>{
        wxcofig =  tpl(new Date().getTime(),Math.random().toString(36).substr(2),res.locals.signature,apiconfig.jsapilist);
        next();
    },(req,res,next)=>{
        let url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
        res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${url}&response_type=code&scope=SCOPE&state=STATE#wechat_redirect`)
    }
);
app.get('/view/home',(req,res)=>{
    res.send("<h1>sdk测试</h1>")
});
app.post("/",(req,res)=>{
    let xml = req.body.xml;
    var obj = {
        fromusername:xml.fromusername[0],
        tousername:xml.tousername[0],
        createTime:new Date().getTime(),
        reply:'欢迎来到hipclub'
    };
    var txt =`
    <xml>
    <ToUserName><![CDATA[${obj.fromusername}]]></ToUserName>
    <FromUserName><![CDATA[${obj.tousername}]]></FromUserName>
    <CreateTime>${obj.createTime}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${obj.reply}]]></Content>
    </xml>
    `;
    res.send(txt);
}).listen(8028,()=>{
    console.log("已开启服务8028")
})
