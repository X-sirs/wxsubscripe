const express = require('express');
const sha1 = require('sha1');
const config = require('./config.js')
let app = express();
module.exports = ()=>{
    app.use((req,res,next)=>{
        const data = req.query;
        let code = sha1([config.token,data.timestamp,data.nonce].sort().join(""));
        if(data.signature==code){
           next();
        }else{
          res.send("request is not from wechat");
        }
      });
      app.listen(8028,()=>{
          console.log("微信开发服务器已经启动--8028")
      })
}
