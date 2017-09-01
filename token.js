const request = require('superagent');
const jsonfile = require('jsonfile');
const apiconfig = require("./apiconfig.js");
let config = require("./config.js");
module.exports = (req,res,next)=>{
    let json_token;
    try{
        json_token = jsonfile.readFileSync('./token.json');
    }catch(err){
        json_token = null;
    };
    if(!json_token||Date.now()+900*1000>json_token.end_time){
        request.get(apiconfig.domain+''+apiconfig.token).query({
            grant_type:"client_credential",
            appid:config.appid,
            secret:config.appsecret
        }).end((err,data)=>{
            let token = data.body;
            token.end_time = Date.now()+token.expires_in*1000;
            jsonfile.writeFileSync('./token.json',data.body,{spaces:4});
            res.locals.token=token.access_token;
            next();
        })
    }else{
        res.locals.token = json_token.access_token;
        next();
    }
   
}