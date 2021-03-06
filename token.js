const request = require('superagent');
const jsonfile = require('jsonfile');
let apiconfig = require("./apiconfig.js");
let config = require("./config.js");
module.exports = (req,res,next)=>{
    let json_token;
    try{
        json_token = jsonfile.readFileSync('./token.json');
    }catch(err){
        json_token = null;
    };
    if(!json_token||Date.now()+900*1000>json_token.end_time){
        request.get(apiconfig.access_token).query({
            corpid: config.appid,
            corpsecret: config.appsecret
        }).end((err,data)=>{
            let token = data.body;
            if(token.access_token){
                token.end_time = Date.now()+token.expires_in*1000;
                jsonfile.writeFileSync('./token.json',data.body,{spaces:4});
                res.locals.token=token.access_token;
                next();
            }else{
                res.send('<h1>获取access_token失败</h1>')
            }
        })
    }else{
        res.locals.token = json_token.access_token;
        next();
    } 
}