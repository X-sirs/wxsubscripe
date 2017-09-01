const request = require('superagent');
const jsonfile = require('jsonfile');
const sha1 = require('sha1');
const apiconfig = require('./apiconfig');
let config = require('./config.js');
function sign (ticket,url){
    let string = [
        `noncestr=${Math.random().toString(36).substr(2)}`,
        `jsapi_ticket=${ticket}`,
        `timestamp=${new Date().getTime()}`,
        `url=${url}`
    ];
    return sha1(string.sort().join());
}
module.exports=(req,res,next)=>{
    let access_token = jsonfile.readFileSync('./token.json');
    let url = req.url;
    if(!access_token.ticket||Date.now()+900*1000>access_token.ticket_end_time){
    request.get(apiconfig.domain+''+apiconfig.api.jsapi_ticket).query({
        access_token:access_token.access_token,
        type:"jsapi"
    }).end((err,data)=>{
        let token = data.body;
        token.ticket_end_time = Date.now()+token.expires_in*1000;
        jsonfile.writeFileSync('./token.json',data.body,{spaces:4});
        res.locals.signature = sign(token.ticket,url);
        res.locals.ticket=token.ticket;
        next();
    })
    }else{
        res.locals.signature = sign(access_token.ticket,url);
        res.locals.ticket = access_token.ticket;
        next();
    }
}