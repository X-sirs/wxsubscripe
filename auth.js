const sha1 = require('sha1');
const config = require('./config.js');
module.exports = ((req,res,next)=>{
    const data = req.query;
    let code = sha1([config.token,data.timestamp,data.nonce].sort().join(""));
    if(data.signature==code){
        //res.send(data.echostr);
        next();
    }else{
        //res.send("request is not from wechat");
        next();
    }
})

