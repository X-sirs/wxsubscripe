let app = require('express')();
let tpl = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>sdk测试</title>
</head>
<body>
    <h1>www----rpl</h1>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
</body>
</html>`;
app.use(require('express-xml-bodyparser')());
app.use(require('./auth.js'));
app.use(require('./token.js'));
app.use('/home',(req,res,next)=>{
        res.send(tpl);
        next();
});
app.post("/",(req,res)=>{
    let xml = req.body.xml;
    console.log(xml,res.locals.token);
    var obj = {
        fromusername:xml.fromusername[0],
        tousername:xml.tousername[0],
        createTime:new Date().getTime(),
        reply:'仙女姐姐会在哪里下凡'
    };
    var txt = `
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
    console.log("已开启服务")
})
