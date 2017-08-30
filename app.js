let app = require('express')();
app.use(require('express-xml-bodyparser')());
app.post("/",(req,res)=>{
    console.log("1111");
    let xml = req.body.xml;
    var obj = {
        fromusername:xml.fromusername[0],
        tousername:xml.tousername[0],
        createTime:new Date().getTime(),
        reply:'仙女姐姐会在哪里下凡'
    };
    console.log(obj);
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
    console.log("已开发服务")
})
