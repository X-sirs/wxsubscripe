const express = require('express');
const sha1 = require('sha1');
const config = require('./config.js')
let app = express();
app.use((req,res)=>{
  const data = req.query;
  let code = sha1([config.token,data.timestamp,data.nonce].sort().join(""));
  if(data.signature==code){
      return res.send(data.echostr)
  }else{
      return res.send(false)
  }
});
app.listen(8028,()=>{
    console.log("微信开发服务器已经启动--8028")
})