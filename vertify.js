const sha1 = require('sha1');
const config = require('./config.js');
let app = require('express')();
app.post('/',(req,res,next)=>{
    const data = req.query;
    console.log(data);
    let code = sha1([config.token,data.timestamp,data.nonce].sort().join(""));
    if(data.signature==code){
        res.end(data.echostr);
    }else{
        res.send("request is not from wechat");
    }
}).listen(8028,()=>{
    console.log("服务器配置");
})
