let app = require('express')();
app.use(require('express-xml-bodyparser')());
// app.use(require('./auth.js'));
app.use(require('./token.js'));
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
    console.log(txt);
    res.send(txt);
}).listen(8028,()=>{
    console.log("已开启服务")
})
